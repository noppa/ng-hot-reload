import provideInjector from './injector';

const provideTimeout = () => {
  return provideInjector().get('$timeout');
};


export default timeout;
