/* ng-hot-reload-loader */
(function(__ngHotReloadLoaderAngularGlobal) {
  var angular = module.hot ? (function() {
    var loader = require(<%= corePath %>);
    return loader.decorateAngular({
      angular: __ngHotReloadLoaderAngularGlobal,
      forceRefresh: Boolean(<%= forceRefresh %>),
      preserveState: Boolean(<%= preserveState %>)
    });
  })() : __ngHotReloadLoaderAngularGlobal;

  try {
    (function() {/* ng-hot-reload-loader end*/

      <%= source %>

    })();/* ng-hot-reload-loader */
  } finally {
    (function() {
      if (module.hot && angular.__ngHotReload$didRegisterProviders) {
        module.hot.accept(function(err) {
          if (err) {
            console.error(err);
          }
        });
      }
    })();
  }
})(<%= requireAngular %>);
/* ng-hot-reload-loader end */
