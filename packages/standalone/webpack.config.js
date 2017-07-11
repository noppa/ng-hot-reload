/* eslint-env node */
const path = require('path');

const config = {
  target: 'node',
  entry: {
    'ng-hot-reload-standalone': path.join(__dirname, 'src', 'index.js'),
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules|\.tpl\.js$/,
      },
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    ws: {
      commonjs2: 'ws',
    },
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
    extensions: ['.js'],
  },
};

module.exports = config;
