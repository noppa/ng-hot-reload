import angularProvider from './ng/angular';
import manualReload from './util/manual-reload';
import updatesProvider from './updates';

const controllers = new Map();

function controllerProvider(moduleName) {
  let updates;

  function create(name, ctor) {
    const angular = angularProvider();
    controllers.set(name, ctor);

    const deps = angular.injector().annotate(ctor);
    // @ts-ignore
    ngHotReload$Controller.$inject = [
      '$controller',
      '$rootScope',
    ].concat(deps);

    // @ts-ignore
    return angular.module(moduleName).controller(name, ngHotReload$Controller);

    function ngHotReload$Controller($controller, $rootScope, ...rest) {
      updates = updatesProvider($rootScope, moduleName, 'controller');
      const ctor = controllers.get(name);
      if (!angular.equals(deps, angular.injector().annotate(ctor))) {
        manualReload(`Controller ${name} has updated its dependencies.`);
      }
      // Collect the controller's dependencies here
      // and pass them to the new controller as local overrides.
      // We need to do thigns this way because this function might've been
      // initialized with locals of its own and we have no way of knowing.
      // In those cases the global $injector would give wrong values, we
      // need to use the same values that were provided to this function.
      const locals = {};
      deps.forEach((name, i) => {
        locals[name] = rest[i];
      });

      return $controller(ctor, locals);
    }
  }

  function update(name, ctor) {
    if (!controllers.has(name)) {
      manualReload(`Controller ${name} hasn't been registered.`);
    }
    controllers.set(name, ctor);
    if (updates) {
      updates.update(name);
    }
  }

  return {
    create,
    update,
  };
}

export default controllerProvider;
export const getController = name => controllers.get(name);
