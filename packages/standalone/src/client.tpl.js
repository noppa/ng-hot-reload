/* globals options */
var socket = new WebSocket('ws://localhost:' + options.port);

socket.addEventListener('message', function(event) {
    var data = event.data ? JSON.parse(event.data) : {};
    console.log('msg', data);
    if (data.message === 'reload') {
        var script = document.createElement('script');
        var query = '?t=' + Date.now();
        script.src = 'http://localhost:' + options.port + '/' + data.src + query;
        document.body.appendChild(script);
    }
});
