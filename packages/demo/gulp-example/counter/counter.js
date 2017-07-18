
class CounterController {

    constructor() {
      this.counter = 1;
    }

}

angular.module('hot-reload-demo')
    .component('counter', {
        controller: CounterController,
        templateUrl: 'counter/counter.html',
    });
