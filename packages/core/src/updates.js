import uniqueId   from 'lodash/uniqueId';
import castArray  from 'lodash/castArray';

export const RECOMPILE = 'ng-hot-reload/recompile';

const depsEqual = a => b => a === b;

export default function($rootScope, moduleName, type) {
  /**
   * Requests the child scopes to recompile
   * @param {string} name Name of the directive/controller/service etc.
   */
  function update(name) {
    // TODO: Better throttle, using $timeout, preferably
    setTimeout(function() {
      $rootScope.$broadcast(RECOMPILE, {
        moduleName,
        type,
        name,
        id: uniqueId(),
      });
    }, 10);
  };

  function tap(deps, $scope, cb) {
    deps = castArray(deps);
    $scope.$on(RECOMPILE, (evt, info) => {
      const canReceive = deps.some(depsEqual(info)) &&
        evt.targetScope !== $scope;

      if (canReceive) {
        cb(evt, info);
      }
    });
  }

  function onUpdate(deps, $scope, cb) {
    return tap(deps, $scope, (evt, info) => {
      if (!evt.defaultPrevented) {
        evt.preventDefault();
        cb(evt, info);
      }
    });
  }

  return {
    update,
    onUpdate,
    tap,
  };
};
