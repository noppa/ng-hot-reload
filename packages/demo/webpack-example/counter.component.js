angular.module('hot-reload-demo').component('counter', {
    template: `
        <div>Counter: {{vm.counter}}</div>
        <button ng-click="vm.addOne()">Add</button>
        `,
    scope: true,
    controllerAs: 'vm',
    controller: class {
        constructor() {
            this.counter = 0;
        }

        addOne() {
            this.counter += 1;
        }
    },
});
