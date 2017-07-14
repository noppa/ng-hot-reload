/* globals __ngHotReloadOptions */

var angular = (function() { // eslint-disable-line no-unused-vars
    var options = __ngHotReloadOptions;
    var root = typeof window !== 'undefined' ? window : this;
    var loader = root[options.ns]['ng-hot-reload-core'];
    return options.firstPassed ?
          loader.update()
        : loader.init(options.angular);
})();
