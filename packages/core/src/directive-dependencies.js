import { error as logError } from './util/log';

export default getDirectiveDependencies;

/**
 * Returns a list of dependencies for a given directive definition.
 * Dependencies include those that are declared for directiveFactory
 * itself and those that are declared for the directive's controller.
 * If the directive has property "templateUrl", it's also included
 * in the dependency list.
 *
 * @param {Function} directiveFactory Factory function for the directive
 * @param {Object} directive Result of invoking the factory function
 * @param {Object} $injector Angular's $injector service
 * @return {string[]} List of depenencies for the directive
 */
function getDirectiveDependencies(directiveFactory, directive, $injector) {
  // Start with the dependencies of the directive itself
  let dependencies = $injector.annotate(directiveFactory);

  if (directive.controller) {
    let ctrl = directive.controller;
    if (typeof ctrl === 'string') {
      try {
        ctrl = $injector.get(getController(ctrl) + 'Controller');
      } catch(err) {
        logError(err);
      }
    }
    if (ctrl) {
      try {
        const ctrlDeps = $injector.annotate(ctrl);
        dependencies = dependencies.concat(ctrlDeps);
      } catch (err) {
        logError(err);
      }
    }
  }

  if (directive.templateUrl) {
    dependencies.push(directive.templateUrl);
  }

  return dependencies;
}

// TODO: Duplicate of a functionality in directive.js
// and probably does not handle all the edge cases.
function getController(name) {
  const [ctrl] = name.split(' as');
  return ctrl;
}
