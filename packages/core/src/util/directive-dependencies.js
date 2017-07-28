import controllerDefinition from './controller-definition';
import { identifierForDependency } from '../updates';

export default getDirectiveDependencies;

const
  addType = type => name => identifierForDependency({ type, name }),
  addCtrl = addType('controller'),
  addTpl = addType('template'),
  addSvc = addType('service');


/**
 * Returns a list of dependencies for a given directive definition.
 * Dependencies include those that are declared for directiveFactory
 * itself and those that are declared for the directive's controller.
 * If the directive has property "templateUrl", it's also included
 * in the dependency list.
 *
 * @param {(Function|any[])=} directiveFactory Factory function
 * @param {Object} directive Result of invoking the factory function
 * @param {Object} $injector Angular's $injector service
 * @return {string[]} List of depenencies for the directive
 */
function getDirectiveDependencies(directiveFactory, directive, $injector) {
  // Start with the dependencies of the directive itself
  let dependencies = directiveFactory ?
    $injector.annotate(directiveFactory) : [];
  // Get the controller factory
  const { controller, name } = controllerDefinition(directive);
  if (controller) {
    dependencies = dependencies.concat($injector.annotate(controller));
  }
  // Mark directive & controller deps as "services"
  dependencies = dependencies.map(addSvc);
  if (name) {
    dependencies.push(addCtrl(name));
  }

  if (directive.templateUrl) {
    dependencies.push(addTpl(directive.templateUrl));
  }

  return dependencies;
}
