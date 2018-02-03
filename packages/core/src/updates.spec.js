import updatesProvider, { identifierForDependency } from './updates';
import { mock } from './testing/mocks';
import schedule from './util/schedule';

describe('updates', function() {
  let $rootScope, $timeout, childScope;

  beforeEach(inject(function(_$rootScope_, _$timeout_) {
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    childScope = $rootScope.$new();
    mock(schedule, task => $timeout(task, 0));
  }));

  it('should call callback when dependency updates', function() {
    const
      controllerUpdates = updatesProvider($rootScope, 'ng', 'controller'),
      templateUpdates = updatesProvider($rootScope, 'ng', 'template');

    const onUpdate = {
      callback() {},
    };
    spyOn(onUpdate, 'callback');

    controllerUpdates.onUpdate(
      [{ name: 'foobar.html', type: 'template' }].map(identifierForDependency),
      childScope,
      onUpdate.callback
    );

    $timeout.flush();

    templateUpdates.update('foobar.html');

    expect(onUpdate.callback).toHaveBeenCalledTimes(1);
  });
});
