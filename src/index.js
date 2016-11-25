
var replacedComponents = [];
const findComponent = (module, type, name) => {
  for (let val of replacedComponents) {
    if (val.module === module && val.type === type && val.name === name)
        return val;
  }
};

function create(module, type, name, def) {
  const component = def[def.length -1];

  const HMR_ReplacedController = function() {
    
    var created = Object.create(component.prototype);
    component.apply(created, arguments);

    console.log('Controller created');
  };

  const _def = Array.prototype.slice.call(def, 0, def.length - 1);
  _def.push(HMR_ReplacedController);
  console.log(_def);

  angular.module(module)[type](name, _def);
}



export { create };