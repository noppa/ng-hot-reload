import * as store from './store';
import angularProvider from './ng/angular';

const updatesKey = 'directive';

const directiveProvider = moduleName => {
  const angular = angularProvider();

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

        if (angular.isFunction(originalDirective)) {
          originalDirective = { compile: originalDirective };
        }

        return Object.assign({}, originalDirective, {
          compile(element) {
            const
              directive = getDirective(name),
              originalCompile =
                angular.isFunction(directive.compile) ?
                    directive.compile
                  : angular.isFunction(directive.link) ?
                      () => directive.link
                      : undefined;

            const originalLink =
              originalCompile && originalCompile.apply(this, arguments);

            return function link($scope, $element) {
              const subscription = store
                .observable(moduleName, updatesKey, name, [])
                .first()
                .subscribe(() => {
                  $compile($element)($scope);
                  $timeout(0);
                });
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
    // Store the new initializer for directive and
    // ask store to update. We'll let store to decide
    // if it should be this directive that updates or
    // perhaps some of its parents.
    if ($injector) {
      const oldDirective = $injector.get(name + 'Directive');
      const newDirective = $injector.invoke(factoryFn, this);

      if (oldDirective && newDirective) {
        angular.forEach(oldDirective, def => {
          angular.extend(def, newDirective);
        });
      }

      store.requestUpdate(moduleName, updatesKey, name);
    } else if (updateQueue) {
      updateQueue.set(name, factoryFn);
    }
  }

  return {
    create,
    update,
  };
};

export default directiveProvider;
