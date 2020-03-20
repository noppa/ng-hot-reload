import template from './hello.html';

class HelloComponentController {
  name: string = ''
  message: string = ''
  $onInit() {
    debugger;
  }
}

const componentName = 'hello'

angular.module('hot-reload-demo')
    .component(componentName, {
        template,
        controller: HelloComponentController,
      });

export default componentName
