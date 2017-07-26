import template from './hello.html';
import './hello.controller.js';

angular.module('hot-reload-demo')
  .directive('hello', function() {
    return {
      template,
      scope: true,
      controller: 'HelloController as vm',
    };
});
