import castArray  from 'lodash/castArray';
import includes   from 'lodash/includes';
import schedule   from './util/schedule';

export const RECOMPILE = 'ng-hot-reload/recompile';
const identifierForDependency = ({ name, type }) => type + '/' + name;

const updateId = (function() {
  let id = 0;
  const current = () =>  `ng-hot-reload/update/#${id}`;
  return {
    get current() {
      return current();
    },
    next() {
      id++;
      return current();
    },
  };
})();

export { updateId };

export default function($rootScope, moduleName, type) {
  /**
   * Requests the child scopes to recompile
   * @param {string} name Name of the directive/controller/service etc.
   */
  function update(name) {
    const id = updateId.next();
    schedule(() => {
      // Broadcast the update event
      $rootScope.$broadcast(RECOMPILE, {
        moduleName,
        type,
        name,
        id,
      });
    });
  }

  function onUpdate(deps, $scope, cb) {
    deps = castArray(deps);
    $scope.$on(RECOMPILE, (evt, info) => {
      console.log('recompile', evt, info);
      const
        identifier = identifierForDependency(info),
        canReceive = includes(deps, identifier);

      if (canReceive) {
        setTimeout(() => cb(evt, info));
      }
    });
  }

  /**
   * Registers a listener for the RECOMPILE event.
   * @param {string[]} deps Dependencies, formatted with
   *  `identifierForDependency`
   * @param {angular.IScope} $scope Scope of the directive
   * @param {Function} cb Callback to call when the RECOMPILE event occurs
   * @return {void}
   */
  // function onUpdate(deps, $scope, cb) {
  //   tap(deps, $scope, (evt, info) => {
  //     cb(evt, info);
  //   });
  // }

  return {
    update,
    onUpdate,
    tap: onUpdate,
  };
};

export { identifierForDependency };
