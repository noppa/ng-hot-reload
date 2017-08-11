import { setAngular } from '../ng/angular';
import { clearMocks } from './mocks';

beforeAll(() => {
  // @ts-ignore
  setAngular(angular);
});

afterEach(() => {
  clearMocks();
});
