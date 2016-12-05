import {provideAngular} from './angular';

const provideInjector = () => {
  return provideAngular().injector(['ng']);
};

export {provideInjector};
