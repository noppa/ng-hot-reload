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
let templateCache;

const decorator =
(loader, module_, providerType, newProvider) => (name, factory) => {
  loader.__ngHotReload$didRegisterProviders = true;

  // Test if the function is being called with the exact same value as before.
  // This can happen with webpack when update has been accepted further
  // up the tree.
  const cacheKey = `${module_.name}/${providerType}/${name}`;
  const noUpdates = factoryCache.has(cacheKey) &&
    factoryCache.get(cacheKey) === factory;

  if (noUpdates) {
    // This counts as an update even though no changes were made.
    // Increment the updates counter so that the automatic
    // refresh check in decorateAngular function doesn't force reload
    // because of this.
    updateId.next();
    return module_;
  }

  factoryCache.set(cacheKey, factory);
  newProvider.call(module_, name, factory);
  return module_;
};

const currentUpdateId = () => updateId.current;
const initLazyVars = once(angular => {
  setAngular(angular);
  templateCache = decorateTemplateRequest();
});

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
 * @param {any} options.angular Unmodified version of angular, only
 *      required in the first run.
 * @return {*} Modified version of angular.
 */
function decorateAngular(options) {
  if (options) {
    setOptions(options);
    initLazyVars(options.angular);
  }
  const angular = angularProvider();
  const angularMock = {
    // Flag that signals to loaders that the mocked angular
    // was indeed used to create something.
    __ngHotReload$didRegisterProviders: false,
  };

  return Object.assign(angularMock, angular, {
    module(name, ...rest) {
      if (!modules.has(name)) {
        modules.set(name, {
          directive: directiveProvider(name),
          component: componentProvider(name),
          controller: controllerProvider(name),
          initialized: undefined,
        });
      }

      const moduleApi = modules.get(name);
      const moduleMock = {};
      /** @type{boolean|void} */
      const isInitialized = moduleApi.initialized;

      let originalModule;
      if (isInitialized) {
        originalModule = angular.module(name);

        const updateId = currentUpdateId();
        setTimeout(() => {
          if (updateId === currentUpdateId()) {
            manualReload('File was changed but no updates were initiated.');
          }
        }, 10);
      } else {
        originalModule = angular.module(name, ...rest);
        if (isInitialized === undefined) {
          moduleApi.initialized = false;
          originalModule.run(() => {
            moduleApi.initialized = true;
          });
        }
      }

      const updateOrCreate = isInitialized ? 'update' : 'create';
      const decorate = providerType => decorator(
          angularMock, moduleMock,
          providerType, moduleApi[providerType][updateOrCreate]);

      Object.assign(
          moduleMock,
          originalModule,
          {
            directive: decorate('directive'),
            component: decorate('component'),
            controller: decorate('controller'),
          },
      );
      return moduleMock;
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
