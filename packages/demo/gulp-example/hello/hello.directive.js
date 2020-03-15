angular.module('hot-reload-demo')
    .directive('hello', function() {
      return {
        templateUrl: 'hello/hello.html',
        scope: true,
        controller: 'HelloController as vm',
      };
    });
