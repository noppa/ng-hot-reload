import * as Rx from 'rxjs';
import { uniqueId } from 'lodash/uniqueId';

/* globals console */

const
  changes = new Rx.Subject(),
  changesObservable = Rx.Observable.from(changes),
  errors = new Rx.Subject(),
  requestRefresh = () => errors.next({ type: 'REFRESH_REQUIRED' });

errors.subscribe(a => console.warn(a));

const observable = (moduleName, type, name, deps) => {
  const eq = e =>
    e.moduleName === moduleName &&
    e.type === type &&
    e.name === name
    ;

  return changesObservable.filter(eq);
};

const requestUpdate = (moduleName, type, name) => {
  changes.next({
    moduleName,
    type,
    name,
    id: uniqueId(),
  });
};

export { observable, requestUpdate, requestRefresh };
