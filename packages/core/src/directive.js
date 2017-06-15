import angularProvider from './ng/angular';
import updatesProvider from './updates';
import { clone, has, get, last } from 'lodash';
import * as preserveState from './preserve-state';

const
  makePrivateKey = typeof Symbol === 'function' ?
      key => Symbol(key)
    : key => key,
  $originalCompile = makePrivateKey('ng-hot-reload/directive/compile');

const directiveProvider = moduleName => {
  const
    angular = angularProvider(),
    { isFunction } = angular;

  // Initialized later
  let $injector, updates;

  const getDirective = name => $injector && $injector.get(name + 'Directive');

  let updateQueue = new Map();
  const directiveVersions = new Map();

  /**
   * NOTE: This function should behave the same as the `directive` function in
   * https://github.com/angular/angular.js/blob/420ceb6e485441d0953fc5ca415a1b93b017b776/src/ng/compile.js#L1128.
   * @param {string} name Name of the directive.
   * @param {Function|Array} directiveFactory An injectable
   *    directive factory function.
   * @return {this} Self for chaining.
   */
  function create(name, directiveFactory) {
    directiveVersions.set(name, 0);

    return angular.module(moduleName).directive(name, [
      '$injector', '$templateCache', '$compile',
      '$animate', '$timeout', '$rootScope',
      function(_$injector, $templateCache, $compile,
      $animate, $timeout, $rootScope) {
        $injector = _$injector;
        if (!updates) {
          updates = updatesProvider($rootScope, moduleName, 'directive');
        }
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

        // Initialized directive definition.
        // This is the object that gets returned from
        // ```
        // angular.module(..).directive(name, function(){ .. })
        //                                         here ^^^^^^
        // ```
        // and contains configuration fields like "controller", "template" etc.
        //
        let originalDirective = $injector.invoke(directiveFactory, this);

        if (isFunction(originalDirective)) {
          originalDirective = { compile: originalDirective };
        }

        const result = {
          [$originalCompile]: originalDirective.compile,
        };

        return Object.assign(result, originalDirective, {
          compile(element) {
            const
              directive = getDirective(name)[0],
              originalCompile =
                isFunction(directive[$originalCompile]) ?
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
              console.log('link', $scope);
              const initialController = getController(directive.controller);
              // Save the initial scope to be used later
              // when the hotswap happens
              const initialState =
                preserveState.snapshot($scope, initialController);

              let subscription;

              if (directiveVersion < directiveVersions.get(name)) {
                // This happens when something, like ngIf-directive,
                // has cached the compiled directive and its link-function
                // to be used after, say, ngIf directive's condition changes.
                // If the directive source has been updated, we *need* that
                // recompilation step to get a fresh new templates etc.
                recompile(false);
              } else {
                updates.onUpdate($scope, (evt, info) => {
                  recompile(true);
                });
              }

              function recompile(rollbackState) {
                //
                // Showtime!
                // update-function should've updated angular's registry
                // of directive definitions by now, so now we just need to
                // force re-compilation of the directive and move some
                // of the old state to the new scope.
                //
                const currentState = rollbackState &&
                  preserveState.snapshot($scope, initialController);

                let scope, canDestroy;
                if (scope.$parent) {
                  scope = scope.$parent;
                  canDestroy = true;
                } else {
                  scope = $scope;
                  canDestroy = false;
                }

                $compile($element)(scope);
                $timeout(rollbackState ? function() {
                  // const
                  //   newController =
                  //     get(getDirective(name), ['0', 'controller']),
                  //   newState = preserveState.snapshot(scope, newController),
                  //   unchanged = preserveState.unchangedProperties(
                  //     initialState, newState);

                  //   preserveState.rollback(
                  //     unchanged, currentState, scope, newController);

                    // Destroy the old scope to let controllers etc.
                    // do their cleanup work
                    if (canDestroy) {
                      $scope.$destroy();
                    }
                } : angular.noop);
              }

              $scope.$on('$destroy', () => {
                console.log('$destroy ' + name);
                subscription && subscription.unsubscribe();
              });

              if (angular.isFunction(originalLink)) {
                // Call the user-defined link-function
                return originalLink.apply(this, arguments);
              }
            };
          },
        });
      }]);
  }

  function update(name, factoryFn) {
    const prevVersion = directiveVersions.get(name) || 0;
    directiveVersions.set(name, prevVersion + 1);

    if ($injector) {
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
    } else if (updateQueue) {
      // The directive has not been initialized yet,
      // store it in a queue to be picked up by the
      // create-function's directive factory
      updateQueue.set(name, factoryFn);
    }
  }

  function getController(ctrl) {
    switch (typeof ctrl) {
      case 'string': {
        const [ctrlName] = ctrl.split(' as');
        return $injector.get(ctrlName + 'Controller');
      }
      case 'object': return last(ctrl);
      default: return ctrl;
    }
  }

  return {
    create,
    update,
  };
};

export default directiveProvider;
