
class CounterController {

    constructor($log) {
        console.log('foobarr');
    }

}

angular.module('hot-reload-demo')
    .component('counter', {
        controller: CounterController,
        templateUrl: 'counter/counter.html',
    });
