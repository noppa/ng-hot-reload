require('angular'); // TODO: Make this optional
/* ng-hot-reload-loader */
(function(__ngHotReloadLoaderAngularGlobal) {
  var angular = module.hot ? (function() {
    var loader = require(<%= apiPath %>);
    var data = module.hot.data;

    if (data && data.firstPassed) {
      return loader.angularUpdate();
    } else {
      return loader.angularInit(__ngHotReloadLoaderAngularGlobal || window.angular);
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
        console.log('dispose');
        data.firstPassed = true;
      });
    })();
  }
})(typeof angular !== 'undefined' && angular);
/* ng-hot-reload-loader end */
