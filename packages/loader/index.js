const corePath = require.resolve('ng-hot-reload-core');
const sourceMap = require('source-map');

// Tests that we don't modify our own library files, i.e. files that are in
// ng-hot-reload/packages or one of the suffixed ng-hot-reload-* directories.
const noTransform =
  /ng-hot-reload([\\/]packages[\\/]|-)(core|loader|standalone)/;

const codeWrapperTop = ({ corePath, forceRefresh, preserveState }) =>
  `
/* ng-hot-reload-loader */
(function(__ngHotReloadLoaderAngularGlobal) {
  var angular = module.hot ? (function() {
    var loader = require(${ corePath });
    return loader.decorateAngular({
      angular: __ngHotReloadLoaderAngularGlobal,
      forceRefresh: Boolean(${ forceRefresh }),
      preserveState: Boolean(${ preserveState })
    });
  })() : __ngHotReloadLoaderAngularGlobal;

  try {
    (function() {/* ng-hot-reload-loader end*/

`;

const codeWrapperBottom = ({ requireAngular }) =>
  `

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
})(${ requireAngular });
/* ng-hot-reload-loader end */
`;

async function transform(source, map) {
  if (this.cacheable) {
    this.cacheable();
  }
  const options = this.getOptions() || {};

  if (noTransform.test(this.resourcePath)) {
    return this.callback(null, source, map);
  }
  const topPart = codeWrapperTop({
    corePath: JSON.stringify(corePath),
    // Boolean options that default to true.
    forceRefresh: options.forceRefresh !== false,
    preserveState: options.preserveState !== false,
  });
  const bottomPart = codeWrapperBottom({
    requireAngular: typeof options.requireAngular === 'string' ?
      options.requireAngular :
      'require("angular")',
  });

  if (!map) {
    // No source maps, just concat the source code together.
    const result = topPart + source + bottomPart;
    this.callback(null, result, map);
    return;
  }

  const callback = this.async();
  await sourceMap.SourceMapConsumer.with(map, null, async (consumer) => {
    const node = sourceMap.SourceNode.fromStringWithSourceMap(source, consumer);
    node.prepend(topPart);
    node.add(bottomPart);
    const result = node.toStringWithSourceMap();
    const newMap = result.map.toJSON();
    callback(null, result.code, newMap);
  });
}

module.exports = transform;
