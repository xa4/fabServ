var serverURL = window.location.protocol + "//" + window.location.host;
var socket = io.connect(serverURL);
//var socket = io.connect('http://raspberrypi.local');
socket.on('news', function (data) {
socket.emit('my other event', { my: 'data' });
});

// other events: change, mouseup, touchend, touchmove