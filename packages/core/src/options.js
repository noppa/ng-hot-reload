import merge from 'lodash/merge';

const defaultOptions = () => ({

});

let options = defaultOptions();

export default () => options;

export const setOptions = opt =>
  options = merge(defaultOptions(), opt);
