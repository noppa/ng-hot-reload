import _ from 'lodash';
import provideAngular from '../ng/angular.js';

function noop() {}

function save(scope, controller = noop) {
    const
        clone = new Map(),
        angular = provideAngular();

    _.forOwn(scope, (val, key) => {
        // Save non-function properties
        if (typeof val !== 'function') {
            if (typeof val === 'object') {
                val = angular.copy(val);
            }

            clone.set(key, val);
        }
    });
}

function nonChangedKeys(savedScope, newScope) {
    return _.keys(newScope)
        .filter(key =>
            savedScope.has(key) &&
            angular.equals(newScope[key], savedScope.get(key)));
}

export { save, nonChangedKeys };
