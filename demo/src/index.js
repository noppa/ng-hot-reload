
angular.module('hot-reload-demo', []);

ngHotReload.ctrl.register('TestCtrl', function($http) {
  console.log('It still works!', $http);
});
