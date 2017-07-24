import getOptions from '../options';

function manualReloadRequired(why) {
  console.warn('Manual reload required: ' + why);
  if (getOptions().forceRefresh) {
    location.reload(true);
  }
}

export default manualReloadRequired;
