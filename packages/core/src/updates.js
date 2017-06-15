import { uniqueId } from 'lodash';

export const RECOMPILE = 'ng-hot-reload/recompile';

export default function($rootScope, moduleName, type) {
    let inProg = false;
    /**
     * Requests the child scopes to recompile
     * @param {string} name Name of the directive/controller/service etc.
     */
    function update(name) {
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

    function tap($scope, cb) {
        $scope.$on(RECOMPILE, (evt, info) => {
            if (evt.targetScope !== $scope) {
                cb(evt, info);
            }
        });
    };

    function onUpdate($scope, cb) {
        return tap($scope, (evt, info) => {
            if (!evt.defaultPrevented) {
                evt.preventDefault();
                cb(evt, info);
                inProg = false;
            }
        });
    };

    return {
        update,
        onUpdate,
        tap,
    };
};
