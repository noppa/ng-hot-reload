import updatesProvider, { identifierForDependency } from './updates';
import { mock } from './testing/mocks';
import schedule from './util/schedule';

describe('updates', function() {
  let $rootScope, $timeout, childScope;

  // @ts-ignore
  beforeEach(inject(function(_$rootScope_, _$timeout_) {
    $rootScope = _$rootScope_;
    $timeout = _$timeout_;
    childScope = $rootScope.$new();
    mock(schedule, task => $timeout(task, 0));
  }));

  it('should invoke callback when dependency updates', function() {
    const
      controllerUpdates = updatesProvider($rootScope, 'ng', 'controller'),
      templateUpdates = updatesProvider($rootScope, 'ng', 'template');

    const onUpdate = {
      callback() {},
    };
    spyOn(onUpdate, 'callback');

    controllerUpdates.onUpdate(
        [{ name: 'foobar.html', type: 'template' }]
            .map(identifierForDependency),
        childScope,
        onUpdate.callback,
    );

    $timeout.flush();

    templateUpdates.update('foobar.html');

    expect(onUpdate.callback).toHaveBeenCalledTimes(1);
  });

  it('should not invoke callback for child scopes if parent already accepted',
      function() {
        const directiveUpdates = updatesProvider($rootScope, 'ng', 'directive');
        const templateUpdates = updatesProvider($rootScope, 'ng', 'template');
        // Create a tree of scopes
        //       A
        //    B      C
        //  D   E   F
        // Where B, D and F are instances of the scope that will get updated.
        const A = childScope;
        const B = childScope.$new();
        const C = childScope.$new();
        const D = B.$new();
        const E = B.$new();
        const F = C.$new();
        const scopes = { A, B, C, D, E, F };
        const onUpdate = jasmine.createSpy('onUpdate');
        const updatedDependency = identifierForDependency(
            { name: 'template.html', type: 'template' },
        );

        for (const scopeName of ['A', 'B', 'C', 'D', 'E', 'F']) {
          const deps = [
            identifierForDependency({ name: scopeName, type: 'directive' }),
          ];

          if (['B', 'D', 'F'].includes(scopeName)) {
            // Make directives B, D, F depend on a common template.
            deps.push(updatedDependency);
          }

          directiveUpdates.onUpdate(
              deps,
              scopes[scopeName],
              () => onUpdate(scopeName),
          );
        }

        $timeout.flush();
        templateUpdates.update('template.html');
        // Only directives B and F are updated.
        // D is not updated because it's B's child scope and thus does
        // not need to be updated (recompiling the parent element will
        // construct the child too).
        expect(onUpdate).toHaveBeenCalledTimes(2);
        expect(onUpdate.calls.allArgs()).toEqual([['B'], ['F']]);
      });
});
