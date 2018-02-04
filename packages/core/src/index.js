import once   from 'lodash/once';
import angularProvider, { setAngular } from './ng/angular';
import directiveProvider  from './directive';
import componentProvider  from './component';
import controllerProvider from './controller';
import manualReload       from './util/manual-reload';
import { setOptions } from './options';
import { updateId } from './updates';
import {
  decorateTemplateRequest,
  getTemplatePathPrefix,
  getTemplatePathSuffix,
} from './template';

const modules = new Map();
const factoryCache = new Map();
let
  templateCache,
  initialized = false;

const decorator =
(loader, module_) => (providerType, newProvider) => (name, factory) => {
  loader.__ngHotReload$didRegisterProviders = true;

  // Test if the function is being called with the exact same value as before.
  // This can happen with webpack when update has been accepted further
  // up the tree.
  const cacheKey = `${module_.name}/${providerType}/${name}`;
  const noUpdates = factoryCache.has(cacheKey)
    && factoryCache.get(cacheKey) === factory;

  if (noUpdates) {
    return module_;
  }

  factoryCache.set(cacheKey, factory);
  newProvider.call(module_, name, factory);
  return module_;
};

/**
 * Creates a decorated version of angular where method "module" is
 * switched to a version that supports hot reloading the directives
 * that are created with it.
 *
 * At first, `decorateAngular(..).module(..).directive(..)` will
 * create a new directive like it would normally do. After the
 * app has been initialized, executing that exact same code would
 * instead update the previously created directive.
 *
 * @param {Object} options Options for the loader.
 * @param {Angular} options.angular Unmodified version of angular, only
 *      required in the first run.
 * @return {*} Modified version of angular.
 */
function decorateAngular(options) {
  if (options) {
    setOptions(options);
  }

  return initialized ? updater() : initializer(options.angular);
}

const currentUpdateId = () => updateId.current;
const initLazyVars = once(angular => {
  setAngular(angular);
  templateCache = decorateTemplateRequest();

  angular.module('ng').run(function() {
    initialized = true;
  });
});

/**
 * Creates a decorated version of angular where method "module" is
 * switched to a version that initializes directives to be ready
 * for hot reloading later.
 *
 * @private
 * @param {Angular} angular The original, unmodified angular instance.
 * @return {Angular} New object that acts like angular but with
 *      some methods changed.
 */
const initializer = angular => {
  initLazyVars(angular);
  const loader = {
    // Flag that signals to loaders that the mocked angular
    // was indeed used to create something.
    __ngHotReload$didRegisterProviders: false,
  };

  return Object.assign(loader, angular, {
    module: function(name) {
      if (!modules.has(name)) {
        modules.set(name, {
          directive: directiveProvider(name),
          component: componentProvider(name),
          controller: controllerProvider(name),
        });
      }

      const module = modules.get(name),
        result = {},
        decorate = decorator(loader, result);

      const patchedModule = Object.assign(
        result,
        angular.module.apply(angular, arguments),
        {
          directive: decorate('directive', module.directive.create),
          component: decorate('component', module.component.create),
          controller: decorate('controller', module.controller.create),
        }
      );

      return patchedModule;
    },
  });
};

/**
 * Creates a decorated version of angular where method "module" is
 * switched to a version that updates existing directives when
 * called with new directive factories.
 *
 * @private
 * @param {*} angular The original, unmodified angular instance.
 * @return {*} New object that acts like angular but with
 *      some methods changed.
 */
function updater() {
  const angular = angularProvider();
  const loader = {
    __ngHotReload$didRegisterProviders: false,
  };

  const updateIdOnStart = currentUpdateId();
  setTimeout(function() {
    if (currentUpdateId() === updateIdOnStart) {
      // No updates were made within timeout. Force reload.
      manualReload(
        'None of the handlers was able to hot reload the modified file.');
    }
  }, 10);

  return Object.assign(loader, angular, {
    module: function(name) {
      const module = modules.get(name);
      if (!module) {
        manualReload(`New module "${name}".`);
        return;
      }
      const result = {};
      const decorate = decorator(loader, result);

      return Object.assign(result, angular.module(name), {
        directive: decorate('directive', module.directive.update),
        component: decorate('component', module.component.update),
        controller: decorate('controller', module.controller.update),
      });
    },
  });
}

function updateTemplate(filePath, file) {
  if (templateCache) {
    templateCache.update(filePath, file);
  } else {
    manualReload('App was not initialized yet.');
  }
}

const templatesPublicApi = {
  update: updateTemplate,
  getTemplatePathPrefix,
  getTemplatePathSuffix,
};


export {
  decorateAngular,
  manualReload,
  templatesPublicApi as template,
  currentUpdateId,
};
