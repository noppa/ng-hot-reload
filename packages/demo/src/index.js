import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .directive('test', function() {
    return {
      template:
        `
          <h3 ng-bind="vm.message + vm.name"></h3>
          <label>Name: <input ng-model="vm.name"></label>
          <hr/>
          <inner></inner>
        `,
      controllerAs: 'vm',
      scope: {},
      controller: function($scope, $log, $interval) {
        console.log('init ctrl test', Object.keys($scope));
        this.name = '';
        this.message = 'Hello ';
      },
    };
  })
  .directive('inner', function() {
    return {
      template: `
        <div>inner counter: {{counter}}</div>
        <button ng-click="addOne()">Add</button>
      `,
      scope: {},
      controllerAs: 'vm',
      controller($scope) {
        $scope.counter = 0;
        $scope.addOne = () => $scope.counter += 1;
      },
    };
  });
