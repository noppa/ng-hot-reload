import elementsModule from './elements.module';
import angularAnimate from './angular-animate';

angular.module('hot-reload-demo', [
  'ui.router', angularAnimate, elementsModule,
]);
