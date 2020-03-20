import helloComponent from './hello/hello.component'

angular.module('hot-reload-demo')
    .config(['$stateProvider', config]);

function config($stateProvider: any) {
  $stateProvider
      .state('home', {
        url: '',
        component: helloComponent,
      });
}
