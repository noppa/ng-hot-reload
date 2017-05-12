import zipObject from 'lodash/zipObject';
import { annotate } from '../annotate';

const proxy = (injector, original, current) => {
  const { inject } = annotate(original);
  function proxiedInjectable(...deps) {
    return injector.invoke(current(), this, zipObject(inject, deps));
  }

  proxiedInjectable.$inject = inject;
  return proxiedInjectable;
};

export default proxy;
