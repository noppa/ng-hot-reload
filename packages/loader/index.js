var template = require('lodash.template'),
  fs = require('fs'),
  path = require('path'),
  templatePath = path.join(__dirname, 'src', 'source.js.tpl'),
  compiled = template(fs.readFileSync(templatePath, 'utf8')),
  apiPath = require.resolve('ng-hot-reload-core');


// Tests that we don't modify our own library files, i.e. files that are in
// ng-hot-reload/packages or one of the suffixed ng-hot-reload-* directories.
var noTransform = /ng-hot-reload([\\/]packages[\\/]|-)(core|loader)/;

function transform(source, map) {
  if(this.cacheable) {
    this.cacheable();
  }

  if(noTransform.test(this.resourcePath)) {
    return this.callback(null, source, map);
  }

  var result = compiled({
    apiPath: JSON.stringify(apiPath),
    source: source,
  });

  return result;
}

module.exports = transform;
