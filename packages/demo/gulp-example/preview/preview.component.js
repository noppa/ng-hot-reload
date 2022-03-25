/* eslint-disable no-multiple-empty-lines */
const logos = {
  ng1: 'https://angular.io/assets/images/logos/angularjs/AngularJS-Shield.svg',
  ng2: 'https://angular.io/assets/images/logos/angular/angular.svg',
  react: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/768px-React-icon.svg.png',
  vue: 'https://vuejs.org/images/logo.png',
  ember: 'https://emberjs.com/images/brand/ember_Ember-Light-e42a2b30.png',
};

function PreviewController() {
  this.frameworks = [
    { name: 'AngularJS', logo: logos.ng1 },
    { name: 'Angular', logo: logos.ng2 },
    { name: 'React', logo: logos.react },
    { name: 'Vue.js', logo: logos.vue },
    { name: 'Ember', logo: logos.ember },
  ];
  this.getSelected = () =>
    this.frameworks.filter(x => x.selected)
        .map(x => x.name)
        .join(', ');
}

angular.module('hot-reload-demo')
    .component('preview', {
      controller: PreviewController,
      templateUrl: 'preview/preview.template.html',
    });
