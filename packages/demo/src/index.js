import 'angular/angular.js';
import './app.module.js';

console.log('index loaded');

angular.module('hot-reload-demo')
  .controller('TestCtrl', function() {
    this.value = 'Hello World! :))';
  });
