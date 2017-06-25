import directiveProvider from './directive';
import componentProvider from './component';
import angularProvider from './ng/angular';

const modules = new Map();

const decorator = module_ => newProvider => (name, factory) => {
  newProvider.call(module_, name, factory);
  return module_;
};

const init = angular => {
  angularProvider.setAngular(angular);

  return Object.assign({}, angular, {
    module: function(name) {
      if (!modules.has(name)) {
        modules.set(name, {
          directive: directiveProvider(name),
          component: componentProvider(name),
        });
      }

      const
        module = modules.get(name),
        result = {},
        decorate = decorator(result);

      return Object.assign(result, angular.module.apply(angular, arguments), {
        directive: decorate(module.directive.create),
        component: decorate(module.component.create),
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
      const result = {};
      const decorate = decorator(result);

      return Object.assign(result, angular.module(name), {
        directive: decorate(module.directive.update),
        component: decorate(module.component.update),
      });
    },
  });
};

export {
  init,
  update,
};
