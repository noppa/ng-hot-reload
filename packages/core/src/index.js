import once   from 'lodash/once';
import assign from 'lodash/assign';

import directiveProvider  from './directive';
import componentProvider  from './component';
import angularProvider    from './ng/angular';
import manualReload       from './manual-reload';
import * as lifecycle        from './util/lifecycle';
import getOptons, { setOptions } from './options';
import {
  getTemplatePathPrefix,
  setTemplatePathPrefix,
  getTemplatePathSuffix,
  setTemplatePathSuffix,
  decorateTemplateRequest,
} from './template';

const modules = new Map();

const decorator = module_ => newProvider => (name, factory) => {
  newProvider.call(module_, name, factory);
  return module_;
};

let templateCache;

let initialized;

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
 * @return {Angular} Modified version of angular.
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
  angularProvider.setAngular(angular);
  templateCache = decorateTemplateRequest();

  angular.module('ng').run(function() {
    initialized = true;
    lifecycle.broadcast('initialized');
  });

  return assign({}, angular, {
    module: function(name) {
      if (!modules.has(name)) {
        modules.set(name, {
          directive: directiveProvider(name),
          component: componentProvider(name),
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
 * @param {Angular} angular The original, unmodified angular instance.
 * @return {Angular} New object that acts like angular but with
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
  setTemplatePathPrefix,
  getTemplatePathSuffix,
  setTemplatePathSuffix,
};


export {
  decorateAngular,
  manualReload,
  templatesPublicApi as template,
  lifecycle,
};
