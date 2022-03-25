const args = require('yargs').argv;
const webpack = require('webpack');

module.exports = function(config) {
  config.set({

    basePath: '',
    frameworks: ['jasmine'],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'packages/core/specs.webpack.js',
    ],

    exclude: [
    ],

    preprocessors: {
      'packages/core/specs.webpack.js': ['webpack'],
    },

    webpack: Object.assign(require('./packages/core/webpack.config.js'), {
      mode: 'development',
      devServer: {
        stats: {
          hash: false,
          version: false,
          timings: false,
          assets: false,
          chunks: false,
          modules: false,
          reasons: false,
          children: false,
          source: false,
          errors: false,
          errorDetails: false,
          warnings: false,
          publicPath: false,
        },
      },
      plugins: [
        new webpack.DefinePlugin({
          TESTING: true,
        }),
      ],
    }),

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
