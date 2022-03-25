import merge from 'lodash/merge';

const defaultOptions = () => ({
  forceRefresh: true,
  preserveState: true,
  logLevel: 'warn',
});

let options = defaultOptions();

export default () => options;

export const setOptions = opt =>
  options = merge(defaultOptions(), opt);
