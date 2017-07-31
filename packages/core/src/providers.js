import angularProvider from './ng/angular';
import privateKey from './util/make-private-key';
import once from 'lodash/once';

const providerNames = [
  'service',
  'factory',
  'constant',
  'value',
  'filter',
];

function decorateProviders(() => {
  const angular = angularProvider();
  providerNames.forEach(name => {
    const original = angular[name];
    angular[name] = ngHotReload$Provider;

    function ngHotReload$Provider() {
      return original.apply(this, arguments);
    };
  });
});