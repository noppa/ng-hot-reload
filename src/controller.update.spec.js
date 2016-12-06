import { ControllerProvider } from './controller';

const testModuleName = 'hot-reload-demo',
  testCtrlName = 'UnitTestController';

describe('ControllerProvider', () => {
  describe('updating a controller through the provider', () => {
    var $controller, $rootScope, $scope, vm, controllerProvider;

    beforeEach(function() {
      controllerProvider = new ControllerProvider(testModuleName);
      // Register a simple controller to test
      controllerProvider
        .register(testCtrlName, class TestCtrl {
          constructor() {
            this.hello = 'Hello';
          }
        });
    });

    beforeEach(angular.mock.module(testModuleName));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;

      $scope = $rootScope.$new();
      spyOn($scope, '$apply');
      vm = $controller(testCtrlName, { $scope: $scope });
    }));

    it('should update the controller correctly', function() {
      expect(vm.hello).toBe('Hello');
      controllerProvider.update(testCtrlName, class {
        constructor() {
          this.hello = 'Hello World';
        }
      });
      expect(vm.hello).toBe('Hello World');
    });

    it('should have existing state in place when updating', function() {
      expect(vm.hello).toBe('Hello');
      controllerProvider.update(testCtrlName, class {
        constructor() {
          this.hello = this.hello + ' World';
        }
      });
      expect(vm.hello).toBe('Hello World');
    });

    it('should call $scope.$apply', function() {
      const currentCount = $scope.$apply.calls.count();
      controllerProvider.update(testCtrlName, class {
        constructor() {}
      });
      expect($scope.$apply.calls.count()).toBe(currentCount + 1);
    });
  });
});
