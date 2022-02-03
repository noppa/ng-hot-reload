// @ts-nocheck
/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const EslintPlugin = require('eslint-webpack-plugin');

const config = {
  devtool: 'source-map',
  entry: {
    'ng-hot-reload-core': path.join(__dirname, 'src', 'index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: 'ngHotReloadCore',
    libraryTarget: 'umd',
    globalObject: '(typeof self !== \'undefined\' ? self : this)',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
    extensions: ['.js'],
  },
  plugins: [
    new EslintPlugin(),
    new webpack.DefinePlugin({
      TESTING: false,
    }),
  ],
};

module.exports = config;
