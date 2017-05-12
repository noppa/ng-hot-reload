var args = require('yargs').argv;

module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['jasmine'],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'packages/demo/src/app.module.js',
      'packages/core/specs.webpack.js',
    ],

    exclude: [
    ],

    preprocessors: {
      'packages/core/specs.webpack.js': ['webpack'],
    },

    webpack: require('./packages/core/webpack.config.js'),

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['Chrome'],

    singleRun: !args.watch,

    concurrency: Infinity,

    client: {
      captureConsole: true,
    },
  });
};
