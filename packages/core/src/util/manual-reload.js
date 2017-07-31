import getOptions from '../options';
import { debug as logDebug } from './log';

function manualReloadRequired(why) {
  logDebug('Manual reload required: ' + String(why));
  if (getOptions().forceRefresh) {
    location.reload(true);
  }
}

export default manualReloadRequired;
