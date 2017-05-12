import controllerProvider from './controller';

const testModuleName = 'hot-reload-demo';

describe('controllerProvider', () => {
  describe('creating a controller through the provider', () => {
    const testCtrlName = 'UnitTestController',
      someValue = {}; // Some value to provide for the controller

    var $controller, $rootScope;

    beforeEach(function() {
      // Register a simple controller to test
      controllerProvider(testModuleName)
        .register(testCtrlName, class TestCtrl {
          constructor() {
            this.testCtrlName = testCtrlName;
          }
        });

      // Register a controller with local bindings
      controllerProvider(testModuleName)
        .register(testCtrlName + 'WithLocalValue', class TestCtrl {
          constructor(someValue) {
            this.someValue = someValue;
          }
        });
    });

    beforeEach(angular.mock.module(testModuleName));

    beforeEach(inject(function(_$controller_, _$rootScope_) {
      $controller = _$controller_;
      $rootScope = _$rootScope_;
    }));

    it('should initialize simple controller correctly', function() {
      var ctrl = $controller(testCtrlName, {
        $scope: $rootScope.$new(),
      });
      expect(ctrl && ctrl.testCtrlName).toBe(testCtrlName);
    });

    it('should initialize controller with locals correctly', function() {
      var ctrl = $controller(testCtrlName + 'WithLocalValue', {
        $scope: $rootScope.$new(),
        someValue,
      });
      expect(ctrl.someValue).toBe(someValue);
    });
  });
});
