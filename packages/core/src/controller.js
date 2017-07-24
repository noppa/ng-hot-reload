import angularProvider from './ng/angular';

const controllers = new Map();

function controllerProvider(moduleName) {
  function create(name, ctor) {
    console.log('create controller woop', name, ctor);
    const angular = angularProvider();
    controllers.set(name, ctor);
    return angular.module(moduleName).controller(name, ctor);
  }

  return {
    create,
    // TODO: Updating the controller and those that depend on it
    update: create,
  };
}

export default controllerProvider;
export const getController = name => controllers.get(name);
