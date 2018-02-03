class EmojiComponentController {
  constructor() {
    this.icon = '🏠';
  }
}

angular.module('hot-reload-demo')
  .component('emoji', {
    controller: EmojiComponentController,
    template: `<span ng-bind="$ctrl.icon"></span>`,
  });
