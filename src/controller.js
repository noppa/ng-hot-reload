import angularProvider from './ng/angular';
import {controllerUpdateError} from './error-handler';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

class ControllerProvider {

  constructor(moduleName) {
    this.moduleName = moduleName;
    this.subject = new Subject();
  }

  register(name, controller) {
    let {subject, moduleName} = this;

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
      console.log(subject);
      const disp = subject
        .filter((c) => c.name === name)
        .subscribe((update) => {
          console.log('Woooo', update);
        });

      $scope.$on('$destroy', () => disp.dispose());

      create();
    }

    angularProvider()
      .module(this.moduleName)
      .controller(name, Ctrl);
  }

}


export {ControllerProvider};
