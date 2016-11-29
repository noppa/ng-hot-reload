import {annotate} from './annotate.js';

describe('annotate function', () => {

  it('should parse function parameter names correctly', () => {
    function TestController(a, bb, ccc) {}

    expect(annotate(TestController)).toEqual(['a', 'bb', 'ccc']);
  });

  it('should work with comments', () => {
    function TestController(a/*:, bb*/, ccc) {}

    expect(annotate(TestController)).toEqual(['a', 'ccc']);
  });

  it('should strip underscores', () => {
    function TestController(_a_, bb, _ccc_) {}

    expect(annotate(TestController)).toEqual(['a', 'bb', 'ccc']);
  });

});
