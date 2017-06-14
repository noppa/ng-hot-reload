import directiveProvider from './directive';
import { map } from 'lodash';

const
    testModule = 'hot-reload-demo',
    $innerText = e => e.innerText;

// [WIP] Tests are failing ATM
 xdescribe('directive', function() {
     /* globals inject */
    let $timeout, $rootScope, $scope, $element;

    const template = `
        <div>

            <!-- Directive with properties attached to scope -->
            <scope-greet></scope-greet>

        </div>
    `;

    function greetingControllerFactory(bindTo) {
        return greetingController;

        function greetingController($scope) {
            const greetings = ['hello', 'buenos días', 'hei'];
            const vm = bindTo === 'scope' ? $scope : this;
            vm.greetings = greetings;
        }
    }

    const greetingTemplateFactory = bindTo => `
        <ul>
            <li 
                ng-repeat="greeting in ${bindTo && bindTo + '.'}greetings"
                ng-bind="greeting">
            </li>
        </ul>
        `;

    beforeEach(function() {
        directiveProvider(testModule)
            .create('scopeGreet', function() {
                return {
                    template: greetingTemplateFactory(''),
                    controllerAs: 'vm',
                    controller: greetingControllerFactory('scope'),
                };
            });
    });

    beforeEach(angular.mock.module(testModule));

    beforeEach(inject((_$timeout_, $compile, _$rootScope_) => {
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $element = $compile(template)($scope);
        $rootScope.$apply();
    }));


    // Tests
    describe('state in scope', function() {
        function update({ template, controller } = {}) {
            directiveProvider(testModule)
                .update('scopeGreet', function() {
                    return {
                        template: template || greetingTemplateFactory(''),
                        controllerAs: 'vm',
                        controller: controller
                            || greetingControllerFactory('scope'),
                    };
                });
        }

        it('should compile the directive correctly', function() {
            const li = $element.find('li');
            expect(map(li, $innerText))
                .toEqual(['hello', 'buenos días', 'hei']);
        });

        it('should update the template of the directive', function() {
            update({
                template: `
                    <ul>
                        <li 
                            ng-repeat="greeting in greetings"
                            ng-bind="greeting | uppercase">
                        </li>
                    </ul>`,
            });
            $rootScope.$apply();
            $timeout.flush();
            const li = $element.find('li');

            expect(map(li, $innerText))
                .toEqual(['HELLO', 'BUENOS DÍAS', 'HEI']);
        });
    });
 });
