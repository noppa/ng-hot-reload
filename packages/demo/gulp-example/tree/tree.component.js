class TreeComponentController {
  constructor(treeService) {
    this.treeService = treeService;
  }

  $onInit() {
    this.compileCount = this.treeService.add();
  }
}

angular.module('hot-reload-demo')
    .component('tree', {
      templateUrl: 'tree/tree.html',
      controller: TreeComponentController,
      bindings: {
        depth: '<',
      },
    });
