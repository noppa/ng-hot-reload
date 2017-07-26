import merge from 'lodash/merge';

const defaultOptions = () => ({
  forceRefresh: true,
  preserveState: true,
});

let options = defaultOptions();

export default () => options;

export const setOptions = opt =>
  options = merge(defaultOptions(), opt);
