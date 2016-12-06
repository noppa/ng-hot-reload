import config from './config';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/partition';

const errors = new Subject();

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
    console.error(msg);
    console.error(err);
  });

export { errors, UnableToUpdateError };
