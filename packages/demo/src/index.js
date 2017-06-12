import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .directive('test', function() {
    return {
      template:
        '<div>{{counter}}</div> <button ng-click="click()">Add :D</button>',
      controllerAs: 'vm',
      controller: function($scope, $log, $interval) {
        $scope.counter = [1, 2];
        $scope.other = 'foo';
        $scope.click = function() {
          $scope.counter.push($scope.counter.length * 2);
        };
        this.foo = 'bar';
      },
    };
  });
