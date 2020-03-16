import './home.controller.js';
import homeTemplate from './home.view.html';

angular.module('hot-reload-demo')
    .config(['$stateProvider', config]);

function config($stateProvider: any) {
  $stateProvider
      .state('home', {
        url: '',
        template: homeTemplate,
        controller: 'HomeController',
        controllerAs: 'vm',
      });
}
