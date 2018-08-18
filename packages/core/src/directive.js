import clone    from 'lodash/clone';
import has      from 'lodash/has';
import isObject from 'lodash/isObject';
import updatesProvider, { identifierForDependency } from './updates';
import angularProvider from './ng/angular';
import getOptions      from './options';
import * as preserveState   from './util/preserve-state';
import getDependencies      from './util/directive-dependencies';
import controllerDefinition from './util/controller-definition';
import makePrivateKey       from './util/make-private-key';
import manualReload from './util/manual-reload';

const
  $originalCompile = makePrivateKey('ng-hot-reload/directive/compile'),
  eligibleForReload = hasIsolateScope;

function hasIsolateScope({ scope }) {
    return scope === true || isObject(scope);
}

/**
 * Factory for the functions that handle calls to angular.module(..).directive.
 *
 * @param {string} moduleName Name of the module
 * @return {Object<{ create: Function, update: Function }>} Api for creating
 *        and updating directives.
 */
const directiveProvider = moduleName => {
  const
    angular = angularProvider(),
    { isFunction } = angular;
  // Initialized later
  let $injector, updates;

  const getDirective = name => $injector.get(name + 'Directive');

  let updateQueue = new Map();
  const directiveVersions = new Map();

  /**
   * NOTE: This function should behave the same as the `directive` function in
   * https://github.com/angular/angular.js/blob/420ceb6e485441d0953fc5ca415a1b93b017b776/src/ng/compile.js#L1128.
   * @param {string} name Name of the directive.
   * @param {Function|Array} directiveFactory An injectable
   *    directive factory function.
   * @return {*} Self for chaining.
   */
  function create(name, directiveFactory) {
    directiveVersions.set(name, 0);

    // @ts-ignore
    ngHotReload$Directive.$inject = [
      '$injector', '$templateCache', '$compile',
      '$animate', '$timeout', '$rootScope',
    ];
    return angular.module(moduleName).directive(name, ngHotReload$Directive);

    function ngHotReload$Directive(_$injector_, $templateCache, $compile,
      $animate, $timeout, $rootScope) {
        $injector = _$injector_;
        if (!updates) {
          updates = updatesProvider($rootScope, moduleName, 'directive');
        }
        const depId = identifierForDependency({ name, type: 'directive' });
        // The directive might've changed before it was initialized
        // the first time. If that's the case, there should be
        // new updated directiveFactory in updateQueue.
        if (updateQueue && updateQueue.has(name)) {
          directiveFactory = updateQueue.get(name);
          updateQueue.delete(name);
          if (updateQueue.size === 0) {
            updateQueue = null;
          }
        }

        const stateDataKey = `ng-hot-reload/directive/state/${name}`;

        // Initialized directive definition.
        // This is the object that gets returned from
        // ```
        // angular.module(..).directive(name, function(){ .. })
        //                                         here ^^^^^^
        // ```
        // and contains configuration fields like "controller", "template" etc.
        //
        let originalDirective = $injector.invoke(directiveFactory, this);

        if (!eligibleForReload(originalDirective)) {
          return originalDirective;
        }

        if (isFunction(originalDirective)) {
          originalDirective = { compile: originalDirective };
        }

        const result = {
          [$originalCompile]: originalDirective.compile,
        };

        return Object.assign(result, originalDirective, {
          compile() {
            const
              directive = getDirective(name)[0],
              originalCompile = isFunction(directive[$originalCompile]) ?
                  // We have received an updated compile-function
                  directive[$originalCompile]
                : isFunction(directive.link) ?
                    () => directive.link
                    : undefined;

            const originalLink =
              originalCompile && originalCompile.apply(this, arguments);

            // Store the current directive version to so that we know
            // if some other directive has cached it and we need to
            // force recompilation.
            const directiveVersion = directiveVersions.get(name);

            return link;

            function link($scope, $element) {
              let controllerAs, initialState;
              const keepState = getOptions().preserveState;
              if (keepState) {
                controllerAs = controllerDefinition(directive).controllerAs;
                // Save the initial scope to be used later
                // when the hotswap happens
                initialState = preserveState.snapshot($scope, controllerAs);
              }

              if (directiveVersion < directiveVersions.get(name)) {
                // This happens when something, like ngIf-directive,
                // has cached the compiled directive and its link-function to
                // be used after, say, when ngIf directive's condition changes.
                // If the directive source has been updated, we *need* that
                // recompilation step to get the updates applied.
                recompile(false);
              } else {
                // Register onUpdate callback that watches changes to
                // any of the directive's dependencies and to the
                // directive itself.
                const deps = [depId].concat(
                  getDependencies(directiveFactory, directive, $injector));
                updates.onUpdate(deps, $scope, (evt, info) => {
                  recompile(keepState);
                });

                if (keepState) {
                  // If we have saved the state of the directive before
                  // updating, we can "roll back" the previous state
                  // so that development can continue from the
                  // directive's previous state.
                  const prevStateData = $element.data(stateDataKey);
                  if (prevStateData) {
                    $element.removeData(stateDataKey);
                    const
                      newState = preserveState.snapshot($scope, controllerAs),
                      unchanged = preserveState.unchangedProperties(
                        prevStateData.initialState, newState);

                    preserveState.rollback(unchanged,
                      prevStateData.currentState, $scope, controllerAs);
                  }
                }
              }

              function recompile(keepState) {
                //
                // Showtime!
                // update-function should've updated angular's registry
                // of directive definitions by now, so now we just need to
                // force re-compilation of the directive and move some
                // of the old state to the new scope.
                //
                const
                  scope = $scope.$parent,
                  currentState = keepState &&
                    preserveState.snapshot($scope, controllerAs);

                if (keepState) {
                  $element.data(stateDataKey,
                    { currentState, initialState });
                }
                // Destroy the old scope to let controllers etc.
                // do their cleanup work.
                $timeout(() => $scope.$destroy());

                $compile($element)(scope);
              }

              if (angular.isFunction(originalLink)) {
                // Call the user-defined link-function
                return originalLink.apply(this, arguments);
              }
            };
          },
        });
      }
  }

  function update(name, factoryFn) {
    const prevVersion = directiveVersions.get(name) || 0;
    directiveVersions.set(name, prevVersion + 1);

    if ($injector) {
      try {
        let
          oldDirective = getDirective(name),
          newDirective = clone($injector.invoke(factoryFn, this));

        if (isFunction(newDirective)) {
          newDirective = { [$originalCompile]: newDirective };
        }

        // We need to keep our own compile-implementation,
        // so let's store newDirective.compile using a safe
        // property key.
        if (has(newDirective, 'compile')) {
          newDirective[$originalCompile] = newDirective.compile;
          delete newDirective.compile;
        }

        if (oldDirective && newDirective) {
          angular.forEach(oldDirective, def => {
            angular.extend(def, newDirective);

            // Important! angular.extend won't (or rather; might not) extend
            // def with privateCompileKey because it could be a Symbol object
            def[$originalCompile] = newDirective[$originalCompile];
          });
        }

        updates.update(name);
      } catch (err) {
        manualReload(String(err && err.message || err));
      }
    } else if (updateQueue) {
      // The directive has not been initialized yet,
      // store it in a queue to be picked up by the
      // create-function's directive factory
      updateQueue.set(name, factoryFn);
    }
  }

  return {
    create,
    update,
  };
};

export default directiveProvider;
