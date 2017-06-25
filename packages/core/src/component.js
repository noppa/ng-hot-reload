import angularProvider from './ng/angular';
import privateKey from './ng/private-key';

function componentProvider(moduleName) {
    const
        angular = angularProvider(),
        { isFunction, isArray, forEach } = angular;

    /**
     * Calls `this.directive` with "normalized" definition object.
     *
     * NOTE: This is almost an exact copy angular's own component function:
     * https://github.com/angular/angular.js/blob/a03b75c6a812fcc2f616fc05c0f1710e03fca8e9/src/ng/compile.js#L1254
     * and this function should be kept functionally equivalent to that one.
     *
     * @param {string} name Name of the component
     * @param {Object} options Component definition object
     * @return {*} Whatever this.directive returns.
     */
    function registerComponent(name, options) {
        return this.directive(name, ['$injector', function($injector) {
            const def = {
                controller: options.controller || function() {},
                controllerAs:
                    identifierForController(options.controller)
                    || options.controllerAs
                    || '$ctrl',
                template: makeInjectable(
                    (options.template || options.templateUrl) ?
                        options.template : ''),
                templateUrl: makeInjectable(options.templateUrl),
                transclude: options.transclude,
                scope: {},
                bindToController: options.bindings || {},
                restrict: 'E',
                require: options.require,
            };

            forEach(options, (val, key) => {
                if (privateKey(key)) {
                    def[key] = val;
                }
            });

            function identifierForController(controller) {
                // TODO: Not implemented
                return;
            }

            function makeInjectable(fn) {
                if (isFunction(fn) || isArray(fn)) {
                    return function($element, $attrs) {
                        return $injector.invoke(fn, this, {
                            $element,
                            $attrs,
                        });
                    };
                } else {
                    return fn;
                }
            }

            return def;
        }]);
    }

    return {
        create: registerComponent,
        update: registerComponent,
    };
};

export default componentProvider;
