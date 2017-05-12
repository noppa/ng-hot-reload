import controllerProvider from './controller';
import angularProvider from './ng/angular';

/* globals console */

const modules = new Map();

const init = angular => {
  angularProvider.setAngular(angular);

  return Object.assign({}, angular, {
    module: function(name) {
      if (!modules.has(name)) {
        const controller = controllerProvider(name);
        modules.set(name, { controller });
      }

      const module = modules.get(name);

      return Object.assign({}, angular.module.apply(angular, arguments), {
        controller: module.controller.register,
      });
    },
  });
};

const update = () => {
  const angular = angularProvider();

  return Object.assign({}, angular, {
    module: function(name) {
      const module = modules.get(name);
      if (!module) {
        console.warn('Refresh required!'); // TODO: Autorefresh?
        return;
      }

      return Object.assign(angular.module(name), {
        controller: module.controller.update,
      });
    },
  });
};

export {
  init,
  update,
};
