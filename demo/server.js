var express = require('express'),
	path = require('path');


var app = express();


app
	.get('/angular.js', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../node_modules/angular/angular.js'));
	})
  .get('/ng-hot-reload.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist/ng-hot-reload.js'));
  })
  .use('/demo/src', express.static(path.resolve(__dirname, './src')))
	.get('/', (req, res) => {
		res.sendFile(path.resolve(__dirname, './index.html'));
	});


app.listen(3000, () => {
 console.log('Listening localhost:3000');
});
