import forOwn   from 'lodash/forOwn';
import getDirectiveDependencies from './util/directive-dependencies';
import updatesProvider from './updates';

/**
 * Decorates $stateProvider so that all calls to `$stateProvider.state`
 * save the dependencies of the states will be stored and later
 * hooked to updates.
 * @param {string} moduleName Name of the module
 * @param {Object} $injector $injector service
 * @param {Object} $stateProvider $stateProvider from ui.router
 * @return {Function} Function that can be used to lazily register
 *    update listeners. We need the laziness because some of the
 *    services that are needed for updating are not ready yet when
 *    we call `$stateProvider.decorator`.
 */
function decorateStateProvider(moduleName, $injector, $stateProvider) {
  const updaters = [];
  $stateProvider.decorator('views', function(state, delegate) {
    const views = delegate(state);
    let $context;

    let deps = [];
    forOwn(views, view => {
      deps = deps.concat(getDirectiveDependencies(undefined, view, $injector));
      $context = view.$context;
    });
    if ($context) {
      updaters.push({
        dependencies: deps,
        is(state) {
          return state.is($context);
        },
      });
    }
    return views;
  });

  return function ngHotReload$uiRouter($rootScope, $state) {
    const updates = updatesProvider($rootScope, moduleName, 'uiRouter.state');
    updaters.forEach(u => {
      updates.tap(u.dependencies, $rootScope, function(evt, info) {
        if (u.is($state)) {
          $state.reload();
        }
      });
    });
  };
}

export { decorateStateProvider };
