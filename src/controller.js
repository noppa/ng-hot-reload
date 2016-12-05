
import {getAngular} from './ng/angular';
import {PubSub} from './pubsub';
import {controllerUpdateError} from './error-handler';

class ControllerProvider {

  constructor(moduleName) {
    this.moduleName = moduleName;
    this.pubsub = new PubSub();
  }

  register(name, controller) {
    let {pubsub, moduleName} = this;

    Ctrl.$inject = [
      '$injector',
      '$scope',
    ];

    function Ctrl($injector, $scope) {
      const create = () => {
        try {
          $injector.invoke(controller, this);
        } catch(err) {
          controllerUpdateError(moduleName, name, err);
        }
      };

      const token = pubsub.subscribe(name, (newDef) => {
        console.log('woop update', newDef);
      });

      $scope.$on('$destroy', () => pubsub.unsubscribe(token));
    }
  }

}
