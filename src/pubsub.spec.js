import {PubSub} from './pubsub';

describe('PubSub class', () => {

  var pubSub;
  beforeEach(() => {
    pubSub = new PubSub();
  });

  it('should call subscriber when publish is called', function(done) {
    var obj = { spy: () => {} };
    spyOn(obj, 'spy');

    pubSub.subscribe('test', obj.spy);

    pubSub.publish('test', 1, 2, 3);

    setTimeout(function() {
      expect(obj.spy).toHaveBeenCalledWith(1, 2, 3);
      done();
    }, 100);
  });

});
