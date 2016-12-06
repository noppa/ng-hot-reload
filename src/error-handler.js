/** @module error-handler */
import config from './config';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/partition';

const errors = new Subject();

/**
* Error class that gets emitted through
* the errors Subject when the hot reloader
* can't handle the update without full reload.
*
* This should just mean that we faced a limitation
* in angular or our hot reload implementation,
* not that there would be actual bugs in the app.
*
*/
class UnableToUpdateError extends Error {
  constructor(msg) {
    super(msg);
  }
}

const [forceRefresh, exceptions] = errors
  .partition(e => UnableToUpdateError.prototype.isPrototypeOf(e));

forceRefresh
  .subscribe(() => {
    console.warn('Full page refresh required');
    if (config.forceRefresh) {
      location.reload();
    }
  });

exceptions
  .subscribe(({ recipeType, recipeName, action, err }) => {
    var msg = `Failed to ${action} ${recipeType} "${recipeName}"`;
    console.log(msg);
    console.log(err.message);
    console.log(err.stack);
  });

export { errors, UnableToUpdateError };
