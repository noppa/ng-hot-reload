/** @module controller */
import angularProvider from './ng/angular';
import safeApply from './ng/safe-apply';
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

  update(name, controller) {
    this.subject.next({
      action: 'update',
      name,
      controller,
    });
  }

  /**
  * Creates a new controller with the given name.
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
      // Creates the controller instance
      const create = () => {
        var locals = {};
        deps.forEach((value, i) => {
         locals[inject[i]] = value;
        });
        try {
          console.log('woop create');
          // Create the controller object, but thell $controller
          // to wait for later before initializing it, so that
          // we can first move component bindings and possibly
          // existing state of the controller to the new instance.
          //
          // NOTE that this lazy initializing, enabled by passing
          // `true` as the third argument, relies on undocumented,
          // private feature of angular. See:
          // https://github.com/angular/angular.js/blob/05a9d3a73cbae70eabce3473084d71aaa2ed348a/src/ng/controller.js#L104
          var init = $controller(controller, locals, true);
          var { instance } = init;
          // Copy local bindings and current state from
          // this controller instance to the new one
          angular.extend(instance, this);

          var updated = init();
          if (this !== undefined) {
            return angular.extend(this, updated);
          } else {
            return updated;
          }
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
          controller = update.controller;
          angular.extend(this, create());
          safeApply($scope);
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
