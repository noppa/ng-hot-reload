import * as store from './store';
import angularProvider from './ng/angular';

const directiveProvider = moduleName => {
  const angular = angularProvider();

  let $injector; // Lazy init

  function create(name, factoryFn) {
    return angular.module(moduleName).directive(name, [
      '$injector', '$templateCache', '$compile', '$animate', '$timeout',
      function(_$injector, $templateCache, $compile, $animate, $timeout) {
        $injector = _$injector;
        //
        // Initialized directive definition.
        // This is the object that gets returned from
        // ```
        // angular.module(..).directive(name, function(){ .. })
        //                                         here ^^^^^^
        // ```
        // and contains configuration fields like "controller", "template" etc.
        //
        const originalDefinition = $injector.invoke(factoryFn, this);

        return Object.assign({}, originalDefinition, {
          compile(element) {
            return function link($scope, $element) {
              const subscription = store
                .observable(moduleName, 'DIRECTIVE', name, [])
                .first()
                .subscribe(() => {
                  $compile($element)($scope);
                  $timeout(0);
                });
              $scope.$on('$destroy', () => {
                subscription.unsubscribe();
              });
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
      const oldDefinition = $injector.get(name + 'Directive');
      const newDefinition = $injector.invoke(factoryFn, this);

      if (oldDefinition && oldDefinition[0] && newDefinition) {
        angular.forEach(oldDefinition, def => {
          angular.extend(def, newDefinition);
        });
      }
    }

    store.requestUpdate(moduleName, 'DIRECTIVE', name);
  }

  return {
    create,
    update,
  };
};

export default directiveProvider;
