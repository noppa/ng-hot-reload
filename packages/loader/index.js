const template = require('lodash.template'),
  fs = require('fs'),
  path = require('path'),
  loaderUtils = require('loader-utils'),
  templatePath = path.join(__dirname, 'src', 'source.js.tpl'),
  compiled = template(fs.readFileSync(templatePath, 'utf8')),
  corePath = require.resolve('ng-hot-reload-core'),
  sourceMap = require('source-map');

// Tests that we don't modify our own library files, i.e. files that are in
// ng-hot-reload/packages or one of the suffixed ng-hot-reload-* directories.
var noTransform = /ng-hot-reload([\\/]packages[\\/]|-)(core|loader|standalone)/;

async function transform(source, map) {
  const callback = this.async();
  if (this.cacheable) {
    this.cacheable();
  }
  const options = loaderUtils.getOptions(this) || {};

  if (noTransform.test(this.resourcePath)) {
    return callback(null, source, map);
  }

  const sourcePlaceholder = '<SOUCE_PLACEHOLDER>';
  const result = compiled({
    corePath: JSON.stringify(corePath),
    source: sourcePlaceholder,
    requireAngular: typeof options.requireAngular === 'string' ?
      options.requireAngular :
      '(require("angular"), angular)',
    // Boolean options that default to true.
    forceRefresh: options.forceRefresh !== false,
    preserveState: options.preserveState !== false,
  });
  const [topPart, bottomPart] = result.split(sourcePlaceholder);
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
