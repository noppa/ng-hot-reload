import controllerDefinition from './controller-definition';

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
  // Get the controller factory
  const { controller } = controllerDefinition(directive);
  if (controller) {
    dependencies = dependencies.concat($injector.annotate(controller));
  }
  if (directive.templateUrl) {
    dependencies.push(directive.templateUrl);
  }

  return dependencies;
}
