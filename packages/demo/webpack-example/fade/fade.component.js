import './fade.css';

class FadeController {
  constructor() {
    this.visible = false;
  }
}

angular.module('hot-reload-demo')
  .component('fade', {
    controller: FadeController,
    template: `
    <div class="fade-wrapper">
      <div ng-if="$ctrl.visible" class="fade-in">
        👻 Boo!
      </div>
      <button ng-click="$ctrl.visible=true" ng-if="!$ctrl.visible">
        Be spooked
      </button>
     </div>
    `,
  });
