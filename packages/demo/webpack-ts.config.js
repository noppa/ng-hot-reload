var webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  path = require('path');

var mode = process.env.NODE_ENV === 'production' ?
  'production' :
  'development';

var entry = ['./webpack-typescript-example/index.ts'];
var tsLoaders = ['ts-loader'];

if (mode === 'development') {
  // Enables hot-reloading using the ng-hot-reload library
  // Only used in development, not in production.
  tsLoaders = ['ng-hot-reload-loader'].concat(tsLoaders);
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
        test: /\.tsx?$/,
        loader: tsLoaders,
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
    extensions: ['.js', '.ts'],
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
