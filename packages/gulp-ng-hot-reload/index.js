'use strict';

var through = require('through2');

module.exports = function() {
    return through.obj(function(file, enc, cb) {
        console.log('cont', file.contents);

        cb(null, file);
    });
};
