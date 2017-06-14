import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .directive('test', function() {
    return {
      template:
        `
          <h3 ng-bind="vm.message + vm.name"></h3>
          <label>Name: <input ng-model="vm.name"></label>
        `,
      controllerAs: 'vm',
      controller: function($scope, $log, $interval) {
        this.name = '';
        this.message = 'Hello! ';
      },
    };
  });
