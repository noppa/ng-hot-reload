var template = require('lodash.template'),
  fs = require('fs'),
  path = require('path'),
  loaderUtils = require('loader-utils'),
  templatePath = path.join(__dirname, 'src', 'source.js.tpl'),
  compiled = template(fs.readFileSync(templatePath, 'utf8')),
  corePath = require.resolve('ng-hot-reload-core');


// Tests that we don't modify our own library files, i.e. files that are in
// ng-hot-reload/packages or one of the suffixed ng-hot-reload-* directories.
var noTransform = /ng-hot-reload([\\/]packages[\\/]|-)(core|loader|standalone)/;

function transform(source, map) {
  if (this.cacheable) {
    this.cacheable();
  }
  var options = loaderUtils.getOptions(this) || {};

  if (noTransform.test(this.resourcePath)) {
    return this.callback(null, source, map);
  }

  var result = compiled({
    corePath: JSON.stringify(corePath),
    source: source,
    requireAngular: typeof options.requireAngular === 'string' ?
      options.requireAngular
      : '(require("angular"), angular)',
    // Boolean options that default to true.
    forceRefresh: options.forceRefresh !== false,
    preserveState: options.preserveState !== false,
  });

  return result;
}

module.exports = transform;
