/**
 * @module mocks
 * Super simple mocking solution that allwos functions to be
 * modified at runtime to specify "mocked" functionality for testing purposes.
 * Hacky, but way easier approach than intergrating DI or
 * module replacement libraries. Works well enough for this library with
 * ~0 runtime impact because webpack + uglifyjs will remove conditional
 * calls to mock functions.
 */

let mocks = null;
let id = 0;

const getMock = _mockId => mocks && mocks[_mockId];

/**
 * Mocks a function.
 * @param {Function} mockableFn Function that has been through `mockable`
 * @param {Function} newFn New implementation for a function
 * @return {void}
 */
const mock = (mockableFn, newFn) => {
  if (!mocks) mocks = Object.create(null);
  // @ts-ignore
  const { _mockId } = mockableFn;
  if (!_mockId) throw new Error(`Function ${mockableFn} is not mockable!`);
  mocks[_mockId] = newFn;
};

const clearMocks = () => mocks = null;

/**
 * Makes a function mockable. That is, after this preparation step, `mock`
 * can be called for the returned function.
 * @param {T} original Function to make mockable
 * @return {T} Mockable function
 * @template T
 */
function mockable(original) {
  function mocked() {
    const overridden = getMock(mocked._mockId);
    return (overridden ? overridden : original).apply(this, arguments);
  }

  mocked._mockId = ++id + '';
  // @ts-ignore
  return mocked;
}

export { mockable, mock, clearMocks };
