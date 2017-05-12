import { annotate } from './annotate.js';

const toString = (val) => Object.prototype.toString.call(val);

describe('annotate function', () => {
  it('should return object with the correct values', () => {
    let { inject, fn } = annotate((a) => a);
    expect(toString(inject)).toBe('[object Array]');
    expect(toString(fn)).toBe('[object Function]');
  });

  it('should parse function parameter names correctly', () => {
    function TestController(a, bb, ccc) {}

    expect(annotate(TestController).inject).toEqual(['a', 'bb', 'ccc']);
  });

  it('should work with comments', () => {
    function TestController(a/* :, bb*/, ccc) {}

    expect(annotate(TestController).inject).toEqual(['a', 'ccc']);
  });

  it('should strip underscores', () => {
    function TestController(_a_, bb, _ccc_) {}

    expect(annotate(TestController).inject).toEqual(['a', 'bb', 'ccc']);
  });

  it('should work with static propety $inject', () => {
    function TestController(ddd, fff) {}
    TestController.$inject = ['a', 'bb'];

    expect(annotate(TestController).inject).toEqual(['a', 'bb']);
  });

  it('should work with function wrapped inside an array', () => {
    let input = ['a', 'bb', function TestController(ddd, ffff) {}];
    expect(annotate(input).inject).toEqual(['a', 'bb']);
  });
});
