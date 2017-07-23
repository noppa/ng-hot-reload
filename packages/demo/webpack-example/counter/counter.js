import template from './counter.html';

class CounterController {

  constructor() {
    this.counter = 1;
  }

  add() {
    this.counter++;
  }

  sub() {
    this.counter--;
  }

}

angular.module('hot-reload-demo')
  .component('counter', {
    controller: CounterController,
    template,
  });
