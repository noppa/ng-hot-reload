import 'angular/angular.js';
import './app.module.js';

angular.module('hot-reload-demo')
  .directive('testDirective', function() {
    return {
      template: '<div>Woop</div>',
      controller: function() {
        console.log('Haa controller');
      },
    };
  });
