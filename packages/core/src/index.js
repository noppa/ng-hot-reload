import directiveProvider from './directive';
import angularProvider from './ng/angular';

const modules = new Map();

const init = angular => {
  angularProvider.setAngular(angular);

  return Object.assign({}, angular, {
    module: function(name) {
      if (!modules.has(name)) {
        modules.set(name, {
          directive: directiveProvider(name),
        });
      }

      const module = modules.get(name);

      return Object.assign({}, angular.module.apply(angular, arguments), {
        directive: module.directive.create,
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
        console.warn('Refresh required!');
        return;
      }

      return Object.assign(angular.module(name), {
        directive: module.directive.update,
      });
    },
  });
};

export {
  init,
  update,
};
