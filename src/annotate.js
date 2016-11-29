
const annotate = (func) => {
  const inject = angular.injector.$$annotate(func),
    fun = typeof func === 'function' ? func : func[func.length - 1];
    
  return {inject, fun};
};


export {annotate};
