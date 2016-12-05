import {provideInjector} from './injector';

const provide$timeout = () => {
  return provideInjector().get('$timeout');
};


export {provide$timeout};
