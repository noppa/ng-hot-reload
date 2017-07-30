import isFinite   from 'lodash/isFinite';
import clone      from 'lodash/clone';
import angularProvider from '../ng/angular';
import { isInjectedValue } from './mark-injected';

const defaultDepth = 5;

const privateKey = /^\$\$/;

/**
 * Wrapper object that tells if the copy was successful and
 * holds possible return value for it.
 * @typedef {Object} Result
 * @property {boolean} success True if the copy was successful, false otherwise.
 * @property {Object} value Holds the copied value if copy was successful,
 *    undefined otherwise.
 */

/**
 * Creates a deep (with limited depth) copy of a given object.
 * This function has some intentional limitations compared to other (deep-)copy
 * functions like `angular.copy` or `_.cloneDeep`.
 *  1. The depth of the copy is limited. Nested object structures that are
 *    deeper than `depth` param are moved to the new object by reference,
 *    without creatign new objects from them. This is mainly to prevent
 *    circular references from crashing the whole thing.
 *  2. Property keys starting with "$$" are ignored and not included in
 *    the returned object. This is to prevent copying "$$hashKey" and
 *    other properties that are private for angular.
 *  3. Functions in anywhere in the data except in prototype results in
 *    FAILED copy. Functions just can't be "copied" without running into
 *    problems with possibly bad local references etc. This function is
 *    meant to only copy stateful data and moving functions with the data
 *    would just cause too much problems.
 *  4. Scope objects, the window object, WeakMaps and any object marked
 *    with Symbol("ng-hot-reload/injected") also causes the copy to fail.
 *
 * @param {Object} $rootScope
 * @param {Object} obj Object to copy
 * @param {number=} [depth=5] How deep to go in nested structures
 * @return {Result} Successful or failed result of the copy
 */
function copyData($rootScope, obj, depth) {
  if (!(isFinite(depth) && depth > 0)) depth = defaultDepth;
  let success = true;
  const angular = angularProvider();
  const $rootScopeProto = Object.getPrototypeOf($rootScope);

  const value = copyDataRec(obj, depth);

  if (success) {
    return {
      value,
      success,
    };
  } else {
    return {
      value: undefined,
      success,
    };
  }

  function copyDataRec(obj, depth) {
    if (!success) return;
    if (depth <= 0 || obj == null) return obj;
    const type = typeof obj;

    if (type === 'function') {
      success = false;
      return;
    }

    if (type === 'object') {
      const uncopyable = angular.isElement(obj)
        || obj === window
        || isInjectedValue(obj)
        || $rootScopeProto.isPrototypeOf(obj);

      const result = !uncopyable && clone(obj);
      if (!result || result.constructor !== obj.constructor) {
        // Lodash was not able to correctly copy the item.
        // It's probably a WeakMap or other problematic value.
        success = false;
        return;
      }
      const keys = Object.keys(result);
      for (let i = 0, n = keys.length; i < n; i++) {
        if (!success) return;
        const key = keys[i];
        // Remove keys like $$hashKey
        if (privateKey.test(key)) {
          delete result[key];
        } else {
          result[key] = copyDataRec(result[key], depth - 1);
        }
      }

      return result;
    }

    return obj;
  }
}

export default copyData;
