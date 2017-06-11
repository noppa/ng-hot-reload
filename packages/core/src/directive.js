import * as store from './store';
import angularProvider from './ng/angular';
import clone from 'lodash/clone';
import has from 'lodash/has';
import get from 'lodash/get';
import * as preserveState from './preserve-state';

const
  updatesKey = 'directive',
  makePrivateKey = typeof Symbol === 'function' ?
      key => Symbol(key)
    : key => key,
  privateCompileKey = makePrivateKey('ng-hot-reload/privateCompileKey');

const directiveProvider = moduleName => {
  const
    angular = angularProvider(),
    { isFunction } = angular;

  let $injector;
  const getDirective = name => $injector && $injector.get(name + 'Directive');

  let updateQueue = new Map();

  /**
   * NOTE: This function should behave the same as the `directive` function in
   * https://github.com/angular/angular.js/blob/420ceb6e485441d0953fc5ca415a1b93b017b776/src/ng/compile.js#L1128.
   * @param {string} name Name of the directive.
   * @param {Function|Array} directiveFactory An injectable
   *    directive factory function.
   * @return {this} Self for chaining.
   */
  function create(name, directiveFactory) {
    return angular.module(moduleName).directive(name, [
      '$injector', '$templateCache', '$compile', '$animate', '$timeout',
      function(_$injector, $templateCache, $compile, $animate, $timeout) {
        $injector = _$injector;
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
          [privateCompileKey]: originalDirective.compile,
        };

        return Object.assign(result, originalDirective, {
          compile(element) {
            console.log('compile', element[0]);
            const
              directive = getDirective(name)[0],
              originalCompile =
                isFunction(directive[privateCompileKey]) ?
                  // We have received an updated compile-function
                  directive[privateCompileKey]
                : isFunction(directive.link) ?
                    () => directive.link
                    : undefined;

            const originalLink =
              originalCompile && originalCompile.apply(this, arguments);

            return function link($scope, $element) {
              const initialController = getController(directive.controller);
              // Save the initial scope to be used later
              // when the hotswap happens
              const initialState =
                preserveState.snapshot($scope, initialController);
              const subscription = store
                .observable(moduleName, updatesKey, name, [])
                .first()
                .subscribe(recompile);

              function recompile() {
                //
                // Showtime!
                // update-function should've updated angular's registry
                // of directive definitions by now, so now we just need to
                // force re-compilation of the directive and move some
                // of the old state to the new scope.
                //
                const currentState =
                  preserveState.snapshot($scope, initialController);
                let scope = $scope.$parent && $scope.$parent.$new();

                if (scope) {
                  // Destroy the old scope to let controllers etc.
                  // do their cleanup work
                  $scope.$destroy();
                } else {
                  scope = $scope;
                }

                $compile($element)(scope);
                $timeout(function() {
                  const
                    newController =
                      get(getDirective(name), ['0', 'controller']),
                    newState = preserveState.snapshot(scope, newController),
                    unchanged = preserveState.unchangedProperties(
                      initialState, newState);

                    preserveState.rollback(
                      unchanged, currentState, scope, newController);
                });
              }
              $scope.$on('$destroy', () => {
                subscription.unsubscribe();
              });

              if (angular.isFunction(originalLink)) {
                return originalLink.apply(this, arguments);
              }
            };
          },
        });
      }]);
  }

  function update(name, factoryFn) {
    if ($injector) {
      let
        oldDirective = getDirective(name),
        newDirective = clone($injector.invoke(factoryFn, this));

      if (isFunction(newDirective)) {
        newDirective = { [privateCompileKey]: newDirective };
      }

      // We need to keep our own compile-implementation,
      // so let's store newDirective.compile using a safe
      // property key.
      if (has(newDirective, 'compile')) {
        newDirective[privateCompileKey] = newDirective.compile;
        delete newDirective.compile;
      }

      if (oldDirective && newDirective) {
        angular.forEach(oldDirective, def => {
          angular.extend(def, newDirective);

          // Important! angular.extend won't (or rather; might not) extend
          // def with privateCompileKey because it could be a Symbol object
          def[privateCompileKey] = newDirective[privateCompileKey];
        });
      }

      store.requestUpdate(moduleName, updatesKey, name);
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
      case 'object': return ctrl[ctrl.length];
      default: return ctrl;
    }
  }

  return {
    create,
    update,
  };
};

export default directiveProvider;
