import { error as logError } from './log';

export default getDirectiveDependencies;

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
