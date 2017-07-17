import uniqueId from 'lodash/uniqueId';

export const RECOMPILE = 'ng-hot-reload/recompile';

export default function($rootScope, moduleName, type) {
  let inProg = false;
  /**
   * Requests the child scopes to recompile
   * @param {string} name Name of the directive/controller/service etc.
   */
  function update(name) {
    console.log('update', name);
    if (!inProg) {
      inProg = true;
      // TODO: Better throttle, using $timeout, preferably
      setTimeout(function() {
        $rootScope.$broadcast(RECOMPILE, {
          moduleName,
          type,
          name,
          id: uniqueId(),
        });
      }, 500);
    }
  };

  function tap(name, $scope, cb) {
    $scope.$on(RECOMPILE, (evt, info) => {
      const canReceive =
        info.moduleName === moduleName &&
        info.name === name &&
        evt.targetScope !== $scope;

      if (canReceive) {
        cb(evt, info);
      }
    });
  }

  function onUpdate(name, $scope, cb) {
    return tap(name, $scope, (evt, info) => {
      if (!evt.defaultPrevented) {
        evt.preventDefault();
        cb(evt, info);
        inProg = false;
      }
    });
  }

  return {
    update,
    onUpdate,
    tap,
  };
};
