import provideAngular from './angular';

const provideInjector = () => {
  return provideAngular().element(document).injector();
};

export default provideInjector;
