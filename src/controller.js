/* @module controller */
import angularProvider from './ng/angular';
import { errors } from './error-handler';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

/**
* Creates and updates controllers of a given module.
*/
class ControllerProvider {

  /**
  *
  * @param {string} moduleName Name of the module to witch
  *                 the created controllers will be added.
  */
  constructor(moduleName) {
    this.moduleName = moduleName;
    this.subject = new Subject();
  }

  /**
  * Creates a new controller with the given name if
  * such controller does not yet exist.
  *
  * We can't currently handle additions of completely
  * new recipes (controllers included), so if a controller
  * with the given name alredy exists, new
  * {@link module:error-handler.UnableToUpdateError} is sent through
  * the "errors Subject", effectively causing a hard refresh of the page.
  *
  * @param {string} name The controller name
  * @param {Function|Array<string|Function>} controller The controller
  * definiton.
  */
  register(name, controller) {
    let { subject, moduleName } = this;

    Ctrl.$inject = [
      '$controller',
      '$scope',
    ];

    function Ctrl($controller, $scope) {
      const angular = angularProvider();
      const updateController = (locals, bindings) => {
        try {
          var init = $controller(controller, locals, true);
          var { instance } = init;
          // Copy local bindings and current state from
          // this controller instance to the new one
          angular.extend(instance, this);
          return init();
        } catch(err) {
          errors.next({
            moduleName, err,
            recipeType: 'controller', recipeName: name, action: 'create',
          });
        }
      };

      const disp = subject
        .filter((c) => c.name === name)
        .subscribe((update) => {
          console.log('Woooo', update);
        });

      $scope.$on('$destroy', () => disp.unsubscribe());

      return updateController();
    }

    angular
      .module(this.moduleName)
      .controller(name, Ctrl);
  }

}


export { ControllerProvider };
