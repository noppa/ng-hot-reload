import isPrivateKey from '../ng/private-key';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import copyData from './copy-data.js';
import { debug as logDebug } from './log';

export { snapshot, unchangedProperties, rollback };

function snapshot(scope, controllerAs) {
  const
    scopeState = new Map,
    $rootScope = scope.$root;

  let $ctrlState;

  snapshotRec(scopeState, scope, controllerAs);
  return { $scope: scopeState, $ctrl: $ctrlState };

  function snapshotRec(map, scope, controllerAs) {
    Object.keys(scope).forEach(key => {
      const value = scope[key];
      const type = typeof value;

      // Recursively collect values for controller instance
      if (key === controllerAs && type === 'object' && value !== null) {
        $ctrlState = new Map();
        snapshotRec($ctrlState, value);
        return;
      }
      // Don't save keys like "$id", "$$childScope", etc.
      if (isPrivateKey(key)) return;

      switch (type) {
        case 'object': {
          const copy = copyData($rootScope, value);
          if (copy.success) {
            map.set(key, copy.value);
          } else {
            logDebug('Failed to copy', key, value);
          }
          break;
        }
        // It doesn't make much sense to save functions
        case 'function':
        case 'symbol':
          break;
        default: {
          map.set(key, value);
          break;
        }
      }
    });
  }
}

/**
 * Returns the property names whose values have not been changed.
 * @param {Object} oldState A state snapshot from the snapshot function.
 * @param {Object} newState A state snapshot from the snapshot function.
 * @return {{$ctrl: string[], $scope: string[]}} List of property names.
 */
function unchangedProperties(oldState, newState) {
  const $scope = [];
  let $ctrl;

  oldState.$scope.forEach(
      _unchangedPropertiesCb(isEqual, $scope, newState.$scope));
  if (oldState.$ctrl && newState.$ctrl) {
    $ctrl = [];
    oldState.$ctrl.forEach(
        _unchangedPropertiesCb(isEqual, $ctrl, newState.$ctrl));
  }
  return {
    $scope,
    $ctrl,
  };
}

/* @private */
function _unchangedPropertiesCb(equals, resultList, otherState) {
  return function(val, key) {
    if (equals(otherState.get(key), val)) {
      resultList.push(key);
    }
  };
}

/**
 * Moves the state from a snapshot to the currently active scope object.
 * @param {Object} unchangedProperties Result of calling unchangedProperties()
 * @param {Object} oldState Result of calling snapshot()
 * @param {Object} scope Active scope object
 * @param {Function=} controllerAs Property to which controller is attached
 */
function rollback(unchangedProperties, oldState, scope, controllerAs) {
  rollbackRec(unchangedProperties.$scope, oldState.$scope, scope, controllerAs);

  function rollbackRec(keys, oldValues, scope, controllerAs) {
    if (isEmpty(keys) && !controllerAs) return;

    Object.keys(scope).forEach(key => {
      const value = scope[key];
      const type = typeof value;
      if (key === controllerAs && type === 'object' && value !== null) {
        rollbackRec(unchangedProperties.$ctrl, oldState.$ctrl, value);
      } else if (keys.indexOf(key) !== -1) {
        const oldValue = oldValues.get(key);
        if (!isEqual(oldValue, value)) {
          scope[key] = oldValues.get(key);
        }
      }
    });
  }
}
