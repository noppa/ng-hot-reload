import angularProvider from '../ng/angular.js';
import { getController } from '../controller';

/**
 * Regex from
 * [angular's source]{@link https://github.com/angular/angular.js/blob/87a586eb9a23cfd0d0bb681cc778b4b8e5c8451d/src/ng/controller.js#L6}
 * Matches the "controllerName as alias" syntax.
 */
const controllerReg = /^(\S+)(\s+as\s+([\w$]+))?$/;
/**
 * Normalizes a configuration object that defines controller and
 * "controller as" alias for a directive.
 * @param {Object} config
 * @return {Object} Config object with properties
 *    "controller" and "controllerAs".
 */
export default function controllerDefinition({ controller, controllerAs }) {
  let name;
  if (typeof controller === 'string') {
    const match = controller.match(controllerReg);
    if (!match) {
      const angular = angularProvider();
      // Controller name is not valid. Throw error with angular's $$minError,
      // that's what angular's own implementation would do. $$minErr is
      // a private function so this part might cause trouble some day, if we
      // got this far, the app wouldn't have worked anyway so...
      // @ts-ignore
      throw angular.$$minErr('$controller')('ctrlfmt',
        'Badly formed controller string \'{0}\'. ' +
        'Must match `__name__ as __id__` or `__name__`.', controller);
    }
    name = match[1];
    controller = getController(name);
    controllerAs = controllerAs || match[3];
  }

  return {
    name,
    controller,
    controllerAs,
  };
};
