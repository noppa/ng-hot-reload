import privateKey from './make-private-key';

const $injected = privateKey('ng-hot-reload/injected');
const hasOwnProperty = Object.hasOwnProperty;

function isInjectedValue(obj) {
  return obj != null &&
    hasOwnProperty.call(obj, $injected) &&
    obj[$injected] === true;
}

function markInjectedValue(obj) {
  if (obj == null || isInjectedValue(obj)) return;
  Object.defineProperty(obj, $injected, {
    value: true,
  });
}

export {
  isInjectedValue,
  markInjectedValue,
};
