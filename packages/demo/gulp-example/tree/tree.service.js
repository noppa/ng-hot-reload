angular.module('hot-reload-demo').factory('treeService', function() {
  let counter = 0;
  return {
    add() {
      return ++counter;
    },
  };
});
