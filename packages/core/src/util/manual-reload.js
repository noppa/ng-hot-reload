import getOptions from '../options';
import { warn as logWarn } from './log';

function manualReloadRequired(why) {
  logWarn('Manual reload required: ' + String(why));
  if (getOptions().forceRefresh) {
    location.reload(true);
  }
}

export default manualReloadRequired;
