// import store from './store';
import angularProvider from './ng/angular';

const directiveProvider = moduleName => {
  const angular = angularProvider();
  const directives = new Map();

  function create(name, fn) {
    return angular.module(moduleName).directive(name, [
      '$injector', '$templateCache', '$compile',
      function($injector, $templateCache, $compile) {
        if (!directives.has(name)) {
          const
            def = $injector.invoke(fn, this),
            modified = Object.assign({}, def, {
              link: function(scope, elem) {
                console.log(scope, elem);
              },
            });

          directives.set(name, {
            def,
            modified,
          });
        }

        return directives.get(name).modified;
      }]);
  }

  return {
    create,
  };
};

export default directiveProvider;
