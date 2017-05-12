import angularProvider from './ng/angular';

beforeAll(() => {
  angularProvider.setAngular(angular);
});
