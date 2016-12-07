/* ng-hot-reload-loader */
if (module.hot) {
  (function() {
    var loader = require(<%= apiPath %>).default;

    module.makeHot = module.hot.data ? module.hot.data.makeHot : loader();
  })();
}

try { /*ng-hot-reload-loader end */

  <%= source %>

/* ng-hot-reload-loader */
} finally {
  if (module.hot) {
    console.log('woop', module.hot);

  }
} /* ng-hot-reload-loader end */
