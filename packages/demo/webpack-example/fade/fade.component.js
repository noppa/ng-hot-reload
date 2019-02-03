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
    <div ng-if="$ctrl.bool" class="fade">
        Fade me in out
    </div>
    <button ng-click="$ctrl.visible=true">Fade In!</button>
    <button ng-click="$ctrl.visible=false">Fade Out!</button>
    `,
  });
