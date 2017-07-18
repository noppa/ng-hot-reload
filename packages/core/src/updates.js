import uniqueId   from 'lodash/uniqueId';
import castArray  from 'lodash/castArray';
import includes   from 'lodash/includes';

export const RECOMPILE = 'ng-hot-reload/recompile';

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

  function tap(names, $scope, cb) {
    names = castArray(names);
    $scope.$on(RECOMPILE, (evt, info) => {
      const canReceive =
        includes(names, info.name) &&
        evt.targetScope !== $scope;

      if (canReceive) {
        cb(evt, info);
      }
    });
  }

  function onUpdate(names, $scope, cb) {
    return tap(names, $scope, (evt, info) => {
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
