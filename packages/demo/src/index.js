import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .directive('test', function() {
    return {
      template:
        '<div>{{counter}}</div> <button ng-click="click()">Add</button>',
      controllerAs: 'vm',
      controller: function($scope, $log, $interval) {
        $scope.counter = 0;
        $scope.other = 'foo';
        $scope.click = function() {
          $scope.counter += 1;
        };
        this.foo = 'bar';
      },
    };
  });
