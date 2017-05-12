import controllerProvider from './controller';
import angularProvider from './ng/angular';

/* globals console */

const modules = [];

const init = angular => {
  angularProvider.setAngular(angular);

  return Object.assign({}, angular, {
    module: function(name, deps) {
      const controller = controllerProvider(name);
      modules.push({ name, deps, controller });

      return Object.assign({}, angular.module.apply(angular, arguments), {
        controller: controller.register,
      });
    },
  });
};

const update = () => {
  console.log('update');
  return angularProvider();
};

export {
  init,
  update,
};
