
const annotate = (func) => {
  const inject = angular.injector.$$annotate(func),
    constr = typeof func === 'function' ? func : func[func.length - 1];

  return {inject, constr};
};


export {annotate};
