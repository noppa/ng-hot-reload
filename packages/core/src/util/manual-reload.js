import getOptions from '../options';
import { warn as logWarn } from './log';
import { mockable } from '../testing/mocks';

let manualReloadRequired = why => {
  logWarn('Manual reload required: ' + String(why));
  if (getOptions().forceRefresh) {
    location.reload(true);
  }
};

// @ts-ignore TESTING == magic global that comes from webpack config.
// Whole if-block is removed by UglifyJS if TESTING === false.
if (TESTING) {
  // @ts-ignore
  manualReloadRequired = mockable(manualReloadRequired);
}

export default manualReloadRequired;
