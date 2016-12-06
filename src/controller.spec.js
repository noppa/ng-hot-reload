import { ControllerProvider } from './controller';

const testModuleName = 'hot-reload-demo';

describe('ControllerProvider', () => {
  describe('creating a controller through the provider', () => {
    var ctrl;

    beforeEach(function() {
      new ControllerProvider(testModuleName)
        .register('UnitTestCtrl', class TestCtrl {

          constructor() {
            this.testCtrlName = 'UnitTestCtrl';
          }

        });
    });

    beforeEach(angular.mock.module(testModuleName));

    beforeEach(inject(function($controller, $rootScope) {
      ctrl = $controller('UnitTestCtrl', { $scope: $rootScope.$new() });
    }));

    it('should have been initialized correctly', function() {
      expect(ctrl).toBeDefined();
      expect(ctrl && ctrl.testCtrlName).toBe('UnitTestCtrl');
    });
  });
});
