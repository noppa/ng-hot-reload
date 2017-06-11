import angularProvider from './ng/angular';
import isPrivateKey from './ng/private-key';

export { snapshot, unchangedProperties, rollback };

function snapshot(scope, controller) {
    const
        angular = angularProvider(),
        scopeState = new Map;

    let $ctrlState;

    snapshotRec(scopeState, scope, controller);
    return { $scope: scopeState, $ctrl: $ctrlState };

    function snapshotRec(map, scope, controller) {
        const controllerIsClass =
            angular.isFunction(controller)
            && !!controller.prototype;
        Object.keys(scope).forEach(key => {
            // Don't save keys like "$id", "$$childScope", etc.
            if (isPrivateKey(key)) return;
            const value = scope[key];
            switch (typeof value) {
                case 'object': {
                    const isControllerInstance =
                        value !== null
                        && controllerIsClass
                        && controller.prototype.isPrototypeOf(value);
                    if (isControllerInstance) {
                        if ($ctrlState) break;
                        // Recursively call this function to save the
                        // values that are saved in the view-model
                        $ctrlState = new Map();
                        snapshotRec($ctrlState, value);
                    } else {
                        map.set(key, angular.copy(value));
                    }
                    break;
                }
                // It doesn't make much sense to save functions
                case 'function': break;
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
 * @return {string[]} List of property names.
 */
function unchangedProperties(oldState, newState) {
    const { equals } = angularProvider();
    let $scope = [], $ctrl;

    oldState.$scope.forEach(
        _unchangedPropertiesCb(equals, $scope, newState.$scope));
    if (oldState.$ctrl && newState.$ctrl) {
        $ctrl = [];
        oldState.$ctrl.forEach(
            _unchangedPropertiesCb(equals, $ctrl, newState.$ctrl));
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
 * @param {Oject} unchangedProperties Result of calling unchangedProperties()
 * @param {Object} oldState Result of calling snapshot()
 * @param {Object} scope Active scope object
 * @param {Function=} controller Controller function/class
 */
function rollback(unchangedProperties, oldState, scope, controller) {
    const
        { isFunction, equals } = angularProvider();
    rollbackRec(unchangedProperties.$scope, oldState.$scope, scope, controller);

    function rollbackRec(keys, oldValues, scope, controller) {
        if (!keys || !keys.length) return;
        const controllerIsClass =
            isFunction(controller)
            && !!controller.prototype;
        Object.keys(scope)
            .forEach(key => {
                const value = scope[key];
                const isControllerInstance =
                    value !== null
                    && controllerIsClass
                    && controller.prototype.isPrototypeOf(value);
                if (isControllerInstance) {
                    rollbackRec(
                        unchangedProperties.$ctrl, oldState.$ctrl,
                        value, controller);
                } else if (keys.indexOf(key) !== -1) {
                    const oldValue = oldValues.get(key);
                    if (!equals(oldValue, value)) {
                        scope[key] = oldValues.get(key);
                    }
                }
            });
    }
}
