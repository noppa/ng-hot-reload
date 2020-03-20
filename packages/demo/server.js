const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const useTypeScript = process.argv.includes('--typescript');

const config = require(
  useTypeScript ?
  './webpack-ts.config.js' :
  './webpack.config.js',
);

new WebpackDevServer(webpack(config), {
  publicPath: '/',
  hot: true,
  historyApiFallback: true,
}).listen(8080, 'localhost', function(err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening localhost:8080');
});
