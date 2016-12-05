
import {annotate} from './annotate';
import {getAngular} from './angular-provider';

const cache = [];

const create = (moduleName, name, def) =>  {
  // Note that this is a mutable object,
  // conf.def will be modified by other parts of the code
  const conf = { moduleName, name, def: annotate(def) };

  Ctrl.$inject = [
    '$injector',
    '$scope'
  ];

  function Ctrl() {
    conf.constr.apply(this, arguments);
  }

  getAngular()
    .module(moduleName)
    .controller(name, Ctrl);
};
