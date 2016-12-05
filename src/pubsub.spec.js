import {PubSub} from './pubsub';

describe('PubSub class', () => {
  let pubSub, $timeout;
  beforeEach(inject((_$timeout_) => {
    pubSub = new PubSub();
    $timeout = _$timeout_;
  }));

  it('should call subscriber when publish is called', function() {
    let obj = {spy: () => {}};
    spyOn(obj, 'spy');

    pubSub.subscribe('test', obj.spy);

    pubSub.publish('test', 1, 2, 3);

    $timeout.flush();

    expect(obj.spy).toHaveBeenCalledWith(1, 2, 3);
  });
});
