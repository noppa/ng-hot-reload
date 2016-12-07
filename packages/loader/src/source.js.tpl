/* ng-hot-reload-loader */
if (module.hot) {
  console.log('woop module.hot');
  (function() {
    var loader = require(<%= apiPath %>);

    console.log('loader loaded', loader);
  })();
}

try {
  <%= source %>
} finally {
  console.log('finallyy');
}
