/* globals options */
var socket = new WebSocket('ws://localhost:' + options.port);

socket.addEventListener('message', function(event) {
    var update = event.data;
    new Function(update)();
});
