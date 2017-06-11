/* ng-hot-reload-loader */
(function(__ngHotReloadLoaderAngularGlobal) {
  var angular = module.hot ? (function() {
    var loader = require(<%= corePath %>);
    var data = module.hot.data;
    if (data && data.firstPassed) {
      return loader.update();
    } else {
      return loader.init(__ngHotReloadLoaderAngularGlobal);
    }
  })() : __ngHotReloadLoaderAngularGlobal;

  try {
    (function() {/* ng-hot-reload-loader end*/

      <%= source %>

    })();/* ng-hot-reload-loader */
  } finally {
    (function() {
      module.hot.accept(function(err) {
        console.log('accept');
        if (err) {
          console.error(err);
        }
      });

      module.hot.dispose(function(data) {
        data.firstPassed = true;
      });
    })();
  }
})(<%= requireAngular %>);
/* ng-hot-reload-loader end */
