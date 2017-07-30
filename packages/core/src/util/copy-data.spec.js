import copyData_ from './copy-data.js';

describe('copy-data function', function() {
  /* globals inject */
  let copyData, $rootScope;

  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
    copyData = copyData_.bind(undefined, $rootScope);
  }));

  it('should create new objects until "depth" limit is reached', function() {
    const original = {
      a: {
        b: {},
      },
    };
    const copy = copyData(original, 2);
    expect(copy.success).toBe(true);
    expect(copy.value).toEqual(original);
    expect(copy.value.a).not.toBe(original.a);
    expect(copy.value.a.b).toBe(original.a.b);
  });

  it('should fail if there are Scope objects', function() {
    const copy = copyData({
      a: {
        a: [1, 2, 3],
        s: $rootScope.$new(),
      },
    });
    expect(copy.success).toBe(false);
  });

  it('should preserve prototypes', function() {
    class Foo {
      constructor() {
        this.data = [1, 2, 3];
      }
    }

    const original = {
      a: new Foo(),
    };
    const copy = copyData(original);

    expect(copy.success).toBe(true);
    expect(copy.value).toEqual(original);
    expect(Foo.prototype.isPrototypeOf(copy.value.a)).toBe(true);
  });
});
