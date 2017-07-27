import once   from 'lodash/once';
import assign from 'lodash/assign';

import angularProvider, { setAngular } from './ng/angular';
import directiveProvider  from './directive';
import componentProvider  from './component';
import controllerProvider from './controller';
import manualReload       from './util/manual-reload';
import { setOptions }     from './options';
import {
  decorateTemplateRequest,
  getTemplatePathPrefix,
  getTemplatePathSuffix,
} from './template';

const modules = new Map();
let
  templateCache,
  initialized = false;

const decorator = module_ => newProvider => (name, factory) => {
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
const initializer = once(angular => {
  setAngular(angular);
  templateCache = decorateTemplateRequest();

  angular.module('ng').run(function() {
    initialized = true;
  });

  return assign({}, angular, {
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
        decorate = decorator(result);

      const patchedModule = Object.assign(
        result,
        angular.module.apply(angular, arguments),
        {
          directive: decorate(module.directive.create),
          component: decorate(module.component.create),
          controller: decorate(module.controller.create),
        }
      );

      return patchedModule;
    },
  });
});

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

  return assign({}, angular, {
    module: function(name) {
      const module = modules.get(name);
      if (!module) {
        manualReload(`New module "${name}".`);
        return;
      }
      const result = {};
      const decorate = decorator(result);

      return assign(result, angular.module(name), {
        directive: decorate(module.directive.update),
        component: decorate(module.component.update),
        controller: decorate(module.controller.update),
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
};
