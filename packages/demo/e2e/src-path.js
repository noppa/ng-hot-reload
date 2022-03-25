var path = require('path');

module.exports = function(...filePath) {
  // Whether the tests are run against "gulp-example" or
  // "webpack-example" depends on command line argument `param.package`.
  const pkg = browser.params.package;
  let sourceDir;
  if (pkg === 'standalone') {
    sourceDir = 'gulp-example';
  } else if (pkg === 'loader') {
    sourceDir = 'webpack-example';
  } else {
    const errorMsg = `Unknown value ${JSON.stringify(pkg)} for option ` +
    `params.package. Possible values are "standalone" and "loader".`;

    throw new Error(errorMsg);
  }

  return path.join(__dirname, '..', sourceDir, ...filePath);
};
