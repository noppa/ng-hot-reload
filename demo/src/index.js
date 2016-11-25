angular.module('hmr.demo', []);

ngHotReload.create('hmr.demo', 'controller', 'DemoCtrl', ['$http', function(http) {

  console.log('controllerrr', http);

}])