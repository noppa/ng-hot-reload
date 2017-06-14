import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .directive('test', function() {
    return {
      template:
        `
          <h3 ng-bind="message + name | uppercase"></h3>
          <label>Name: <input ng-model="name"></label>
        `,
      controller: function($scope, $log, $interval) {
        $scope.name = '';
        $scope.message = 'Hello :)';
      },
    };
  });
