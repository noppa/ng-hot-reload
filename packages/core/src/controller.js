import angularProvider from './ng/angular';
import safeApply from './ng/safe-apply';
import { errors } from './error-handler';
import { annotate } from './annotate';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

const controller = moduleName => {
  const subject = new Subject();

  /**
  * Creates a new controller with the given name.
  *
  * @param {string} name The controller name
  * @param {Function|Array<string|Function>} controller The controller
  * definiton.
  */
  function register(name, controller) {
    const angular = angularProvider();
    const { inject } = annotate(controller);

    Ctrl.$inject = [
      '$injector',
      '$scope',
    ].concat(inject);

    function Ctrl($injector, $scope, ...deps) {
      // Creates the controller instance
      const create = () => {
        // Build object where values are services that we get from
        // angular to `deps` and keys are from the
        // `annotate(controller).inject` list
        const locals = {};
        deps.forEach((value, i) => {
         locals[inject[i]] = value;
        });

        try {
          const
            context = Object.create(this),
            instance = $injector.invoke(controller, context, locals);

          return instance;
        } catch(err) {
          errors.next({
            moduleName, err,
            recipeType: 'controller', recipeName: name, action: 'create',
          });
        }
      };

      const disp = subject.subscribe((update) => {
          controller = update.controller;
          angular.extend(this, create());
          safeApply($scope);
        });

      $scope.$on('$destroy', () => disp.unsubscribe());

      return create();
    }

    angular
      .module(moduleName)
      .controller(name, Ctrl);
  }

  function update(name, controller) {
    subject.next({
      action: 'update',
      name,
      controller,
    });
  }

  return {
    update,
    register,
  };
};

export default controller;
