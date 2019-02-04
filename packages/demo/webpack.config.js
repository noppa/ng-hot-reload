var webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  path = require('path');

var mode = process.env.NODE_ENV === 'production'
  ? 'production'
  : 'development';

var entry = ['./webpack-example/index.js'];
var jsLoaders = ['babel-loader'];

if (mode === 'development') {
  // Enables hot-reloading using the ng-hot-reload library
  // Only used in development, not in production.
  jsLoaders = ['ng-hot-reload-loader'].concat(jsLoaders);
  entry = [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
  ].concat(entry);
}

module.exports = {
  mode: mode,
  entry: entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: jsLoaders,
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
  },
};
