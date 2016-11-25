var webpack = require('webpack');
var path = require('path');
var libraryName = 'library';
var outputFile = libraryName + '.js';

var config = {
  entry: path.join(__dirname, 'src', 'index.js'),
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: "eslint-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  }
};

module.exports = config;