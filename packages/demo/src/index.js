import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .directive('test', function() {
    return {
      template:
        '<div>{{counter}}</div> <button ng-click="click()">Adddd :)</button>',
      compile() {
        console.log('compile 2');
      },
      controller: function($scope, $log) {
        $scope.counter = 0;
        $scope.click = function() {
          $scope.counter += 5;
        };
      },
    };
  });
