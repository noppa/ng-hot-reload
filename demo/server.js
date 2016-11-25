var express = require('express'),
	path = require('path');


var app = express();


app
	.get('/angular.js', (req, res) => {
		res.sendFile(path.resolve('../node_modules/angular/angular.js'));
	})
  .get('/ng-hot-reload.js', (req, res) => {
    res.sendFile(path.resolve('../dist/ng-hot-reload.js'))
  })
  .use('/demo/src', express.static(path.resolve('./src')))
	.get('/', (req, res) => {
		res.sendFile(path.resolve('./index.html'));
	});


app.listen(3000, () => { console.log('Server up and running!'); });