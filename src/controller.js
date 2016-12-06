/** @module controller */
import angularProvider from './ng/angular';
import { errors } from './error-handler';
import { annotate } from './annotate';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

/**
* Creates and updates controllers of a given module.
*
* @param {string} moduleName Name of the module to witch
*                 the created controllers will be added.
*/
class ControllerProvider {

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
  * {@link module:error-handlerUnableToUpdateError|UnableToUpdateError}
  * is sent through the "errors Subject", effectively causing a hard
  * refresh of the page.
  *
  * @param {string} name The controller name
  * @param {Function|Array<string|Function>} controller The controller
  * definiton.
  */
  register(name, controller) {
    let { subject, moduleName } = this;
    const angular = angularProvider();

    const { inject } = annotate(controller);

    Ctrl.$inject = [
      '$controller',
      '$scope',
    ].concat(inject);

    function Ctrl($controller, $scope, ...deps) {
      const create = () => {
        var locals = {};
        deps.forEach((value, i) => {
         locals[inject[i]] = value;
        });
        console.log(locals);
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

      return create();
    }

    angular
      .module(this.moduleName)
      .controller(name, Ctrl);
  }

}


export { ControllerProvider };
