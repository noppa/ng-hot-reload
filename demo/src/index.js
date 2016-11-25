angular.module('hmr.demo', []);

HMR.create('hmr.demo', 'controller', 'DemoCtrl', ['$http', function(http) {

  console.log('controllerrr', http);

}])