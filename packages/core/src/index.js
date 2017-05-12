import { ControllerProvider } from './controller';
import angularProvider from './ng/angular';

/* globals console */

const modules = [];

const angularInit = angular => {
  angularProvider.setAngular(angular);

  return Object.assign({}, angular, {
    module: function(name, deps) {
      const controllerProvider = new ControllerProvider(name);
      modules.push({ name, deps, controllerProvider });
      return Object.assign({}, angular.module.apply(angular, arguments), {
        controller: controllerProvider.register.bind(controllerProvider),
      });
    },
  });
};

const angularUpdate = () => {
  console.log('update init');
};

export {
  angularInit,
  angularUpdate,
};
