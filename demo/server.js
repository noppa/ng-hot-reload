var express = require('express'),
	path = require('path');


var app = express();


app
	.get('/angular.js', (req, res) => {
		res.sendFile(path.resolve('../node_modules/angular/angular.js'));
	})
  .use('/src', express.static(path.resolve('../src')))
  .use('/demo/src', express.static(path.resolve('./src')))
	.get('/', (req, res) => {
		res.sendFile(path.resolve('./index.html'));
	});


app.listen(3000, () => { console.log('Server up and running!'); });