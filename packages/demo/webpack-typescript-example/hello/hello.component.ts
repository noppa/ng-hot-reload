import template from './hello.html';

class HelloComponentController {
  name: string = ''
  message: string = ''
}

angular.module('hot-reload-demo')
    .component('hello', {
        template,
        controller: HelloComponentController,
      });
