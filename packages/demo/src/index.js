import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .directive('test', function() {
    return {
      template:
        '<div>{{counter}}</div> <button ng-click="click()">Add :o</button>',
      compile() {
        console.log('compile 2');
      },
      controllerAs: 'vm',
      controller: function($scope, $log, $interval) {
        $scope.counter = 0;
        $scope.click = function() {
          $scope.counter += 1;
        };

        const key = $interval(() => $scope.counter++, 1000);
        $scope.$on('$destroy', () => $interval.cancel(key));
      },
    };
  });
