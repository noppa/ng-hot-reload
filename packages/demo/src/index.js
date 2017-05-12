import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .controller('TestCtrl', function($interval, $scope) {
    this.value = 'Counter: 0';
    let counter = 0;
    console.log('scope', $scope);
    $interval(() => {
      counter++;
      this.value = 'Counter: ' + counter;
    }, 2000);
  });
console.log(angular.module('hot-reload-demo'));
//
