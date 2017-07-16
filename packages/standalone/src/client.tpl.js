/* globals options */
var socket = new WebSocket('ws://localhost:' + options.port);

socket.addEventListener('message', function(event) {
  var data = event.data ? JSON.parse(event.data) : {};
  if (data.message !== 'reload') {
    return;
  }

  if (data.fileType === 'script') {
    var script = document.createElement('script');
    var query = '?t=' + Date.now();
    script.src = 'http://localhost:' + options.port + '/' + data.src + query;
    document.body.appendChild(script);
  } else if (data.fileType === 'template') {
    var ngHotReload = (options.root || window)[options.ns].ngHotReloadCore;
    ngHotReload.templates.update(data.filePath, data.file);
  } else {
    console.log('Unknown file type, manual refresh required.');
  }
});
