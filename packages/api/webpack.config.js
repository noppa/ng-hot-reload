var path = require('path');

var config = {
  entry: {
    // 'ng-hot-reload': path.join(__dirname, 'src', 'index.js'),
    'webpack-loader': path.join(__dirname, 'src', 'webpack-loader', 'index.js'),
  },
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    // library: 'ngHotReload',
    // libraryTarget: 'umd',
    // umdNamedDefine: true,
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /node_modules/,
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js'],
  },
};

module.exports = config;
