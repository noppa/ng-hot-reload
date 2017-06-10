import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .directive('test', function() {
    return {
      template:
        '<div>jes {{counter}}</div> <button ng-click="click()">Add</button>',
      controller: function($scope, $log) {
        $scope.counter = 0;
        $scope.click = function() {
          $scope.counter += 1;
        };
      },
    };
  });
