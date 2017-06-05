import * as store from './store';
import angularProvider from './ng/angular';
import proxy from './util/proxy-injectable';
import { annotate } from './annotate';
import { getTemplate } from './template';

const canReRender = def => {
  return typeof def.template === 'string' && !def.compile;
};

// TODO: Implementation
const
  controllerDeps = () => [],
  templateName = () => '';

const directiveProvider = moduleName => {
  const angular = angularProvider();
  const directives = new Map();

  function create(name, fn) {
    const { inject } = annotate(fn);

    directives.set(name, fn);

    return angular.module(moduleName).directive(name, [
      '$injector', '$templateCache', '$compile', '$animate', '$timeout',
      function($injector, $templateCache, $compile, $animate, $timeout) {
        // Initializes the directive using an implementation that
        // can either be the one we set when `create(name, fn)` was
        // first called, or some implementation that has been
        // created later with `update(name, fn)`
        //
        const init = () => $injector.invoke(directives.get(name), this);
        // Initialized directive definition.
        // This is the object that gets returned from
        // ```
        // angular.module(..).directive(name, function(){ .. })
        //                                         here ^^^^^^
        // ```
        // and contains configuration fields like "controller", "template" etc.
        //
        let definition = init();

        if (!canReRender(definition)) {
          return definition;
        }

        const result = Object.assign({}, definition, {
            // This is where the magic happens.
            // Create a compile method that will hook to events from "store"
            // and re-compile itself if needed.
            compile($element) {
              return function($scope) {
                const deps = inject
                  .concat(controllerDeps(definition))
                  .map(name => ({ name }))
                  .concat([
                    { type: 'TEMPLATE', name: templateName(definition) },
                  ]);

                // Get observable that listens to changes to this directive
                // or any of its dependencies
                const dispose = store
                  .observable(moduleName, 'DIRECTIVE', name, deps)
                  .first()
                  .subscribe(function() {
                    // This directive or some of its dependencies has changed.
                    // If this directive itself has changed, it has gone
                    // through `update(name, newDirectiveDefinition)`, so we
                    // can just crab the current implementation from
                    // `directives` cache and re-compile the element.
                    definition = init();
                    console.log($element, $compile);
                    $compile($element)($scope);
                  });

                $scope.$on('$destroy', () => {
                  dispose();
                });

                if (typeof definition.link === 'function') {
                  return definition.link.apply(this, arguments);
                }
              };
            },
          });

        if (typeof definition.controller === 'function') {
          const lazy = () => definition.controller;
          result.controller = proxy($injector, lazy(), lazy);
        }

        return result;
      }]);
  }

  function update(name, fn) {
    // Store the new initializer for directive and
    // ask store to update. We'll let store to decide
    // if it should be this directive that updates or
    // perhaps some of its parents.
    console.log('update');
    directives.set(name, fn);
    store.requestUpdate(moduleName, 'DIRECTIVE', name);
  }

  return {
    create,
    update,
  };
};

export default directiveProvider;
