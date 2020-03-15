/* globals __ngHotReloadOptions */

var angular = (function() { // eslint-disable-line no-unused-vars
  var options = __ngHotReloadOptions;
  var root = typeof window !== 'undefined' ? window : this;
  if (!root[options.ns]) {
    throw new Error(
        'window["' + options.ns + '"] is undefined! ' +
        'You need to load the standalone ng-hot-reload client ' +
        'before files can be reloaded.',
    );
  }
  var loader = root[options.ns].ngHotReloadCore;
  return loader.decorateAngular(options);
})();
