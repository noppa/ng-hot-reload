/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const EslintPlugin = require('eslint-webpack-plugin');

const config = {
  target: 'node',
  devtool: 'source-map',
  entry: {
    'ng-hot-reload-standalone': path.join(__dirname, 'src', 'index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules|ng-hot-reload-core|\.tpl\.js$/,
      },
    ],
  },
  // Don't include these npm modules in the bundle
  externals: {
    ws: {
      commonjs2: 'ws',
    },
    express: {
      commonjs2: 'express',
    },
    through2: {
      commonjs2: 'through2',
    },
    'ng-hot-reload-core': {
      commonjs2: 'ng-hot-reload-core',
    },
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
    extensions: ['.js'],
  },
  plugins: [new EslintPlugin()],
};

const clientConfig = {
  target: 'web',
  devtool: 'source-map',
  entry: {
    client: path.join(__dirname, 'src', 'client-prebuilt.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'ngHotReloadStandalone',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
  },
  plugins: [
    new EslintPlugin(),
    new webpack.DefinePlugin({
      options: JSON.stringify({
        port: 3100,
        ns: 'ngHotReloadStandalone',
      }),
    }),
  ],
};

module.exports = [config, clientConfig];
