
angular.module('hot-reload-demo')
  .config(['$stateProvider', config]);

function config($stateProvider) {
  $stateProvider
    .state('home', {
      url: '',
      templateUrl: 'home.view.html',
      controller: 'HomeController',
      controllerAs: 'vm',
    });
}
