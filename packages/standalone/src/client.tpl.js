/* globals options */
/* eslint-disable comma-dangle */

var opt = options;
var socket = new WebSocket('ws://localhost:' + opt.port);

socket.addEventListener('message', function(event) {
  var ngHotReloadCore = (opt.root || window)[opt.ns].ngHotReloadCore;
  var data = event.data ? JSON.parse(event.data) : {};
  if (data.message !== 'reload') {
    return;
  }

  if (data.fileType === 'script') {
    // If this is a js file, update by creating a script tag
    // and loading the updated file from the ng-hot-reload server.
    var script = document.createElement('script');
    // Disable any caching the browser might want to do
    var query = '?t=' + Date.now();
    script.src = 'http://localhost:' + opt.port + '/' + data.src + query;
    document.body.appendChild(script);
  } else if (data.fileType === 'template') {
    ngHotReloadCore.template.update(data.filePath, data.file);
  } else {
    var errorMsg = 'Unknown file type ' + data.filePath;
    ngHotReloadCore.manualReload(errorMsg);
  }
});
