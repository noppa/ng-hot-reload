import castArray  from 'lodash/castArray';
import includes   from 'lodash/includes';
import schedule   from './util/schedule';
import makePrivateKey from './util/make-private-key';

const SCOPE_COMPILING = makePrivateKey('ng-hot-reload/recompiling');
export const RECOMPILE = 'ng-hot-reload/recompile';
const identifierForDependency = ({ name, type }) => type + '/' + name;

const updateId = (function() {
  let id = 0;
  const current = () =>  `ng-hot-reload/update/#${id}`;
  return {
    get current() {
      return current();
    },
    next() {
      id++;
      return current();
    },
  };
})();

export { updateId };

export default function($rootScope, moduleName, type) {
  /**
   * Requests the child scopes to recompile
   * @param {string} name Name of the directive/controller/service etc.
   */
  function update(name) {
    const id = updateId.next();
    // Broadcast the update event.
    $rootScope.$broadcast(RECOMPILE, {
      moduleName,
      type,
      name,
      id,
    });
  }

  /**
   * Registers a listener for the RECOMPILE event.
   * @param {string[]} deps Dependencies, formatted with
   *  `identifierForDependency`
   * @param {angular.IScope} $scope Scope of the directive
   * @param {Function} cb Callback to call when the RECOMPILE event occurs
   * @return {void}
   */
  function onUpdate(deps, $scope, cb) {
    deps = castArray(deps);
    // NOTE: `schedule` must be used here because we might get called
    // *from* a onUpdate callback when a directive is being recompiled.
    // Calling $scope.on synchronously would cause an infinite loop
    // because the event could already be ongoing.
    schedule(() => {
      $scope.$on(RECOMPILE, (evt, info) => {
        const identifier = identifierForDependency(info);
        const canReceive = includes(deps, identifier);
        // Check if the scope or its parent scope is already
        // being recompiled.
        const isCompiling = Boolean(
          $scope[SCOPE_COMPILING]
          || $scope.$parent && $scope.$parent[SCOPE_COMPILING]
        );

        if (canReceive && !isCompiling) {
          $scope[SCOPE_COMPILING] = true;
          cb(evt, info);
        } else {
          $scope[SCOPE_COMPILING] = isCompiling;
        }
        // Reset the flag after the event
        // has been processed synchronously.
        schedule(() => {
          $scope[SCOPE_COMPILING] = false;
        });
      });
    });
  }

  return {
    update,
    onUpdate,
    tap: onUpdate,
  };
};

export { identifierForDependency };
