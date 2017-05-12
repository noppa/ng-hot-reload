
const annotate = (func) => {
  const inject = angular.injector.$$annotate(func),
    fn = typeof func === 'function' ? func : func[func.length - 1];

  return { inject, fn };
};


export { annotate };
