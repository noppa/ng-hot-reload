
const annotate = (func) => {
  return angular.injector.$$annotate(func);
};


export {annotate};
