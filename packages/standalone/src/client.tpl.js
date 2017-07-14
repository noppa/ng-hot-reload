/* globals options */
'use strict';

var socket = new WebSocket('ws://localhost:' + options.port);

socket.addEventListener('open', function(event) {
    console.log('wooo');
});

socket.addEventListener('message', function(event) {
    console.log('message', event.data);
});

socket.addEventListener('close', function(event) {
    console.log('close');
});
