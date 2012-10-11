
/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , module = require('./routes/module')({app: app})
  , http = require('http')
  //, https = require('https')
  , path = require('path')
  , SerialPort = require("serialport").SerialPort
  , nano = require('nano')('http://admin:pouet@localhost:5984')
  , io = require('socket.io')
  , modules = nano.use('modules')
  , rooms = nano.use('rooms')
  , request = require('request')
  , fs = require('fs')
  , async = require('async');

/*
var privateKey = fs.readFileSync('./ssl/server.key').toString();
var certificate = fs.readFileSync('./ssl/server.crt').toString();
var options = {
  key : privateKey
, cert : certificate
}
*/

var serialPort = new SerialPort("/dev/ttyAMA0", {baudrate : 57600});

var message = new Array();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  async.parallel({
      modules: function(callback){
        modules.view('modules', 'list', function(err, body) {
          if (!err) {
            callback(null,body.rows);
          } else console.log(err);
        });
      },
      rooms: function(callback){
        rooms.view('rooms', 'list', function(err, body) {
          if (!err) {
            callback(null,body.rows);
          } else console.log(err);
        });
      },
  },
  function(err, results) {
      //console.log(results);
      for (var i in results.modules) {
        val = results.modules[i];
        console.log(val.value);
      }
      res.render('index', { modules: results.modules, rooms: results.rooms });
  });
});

app.get('/colour', module.colour);

app.get('/settings/:id', function(req, res){
  async.parallel({
      module: function(callback){
        modules.get(req.params.id, { revs_info: false }, function(err, body) {
          if (!err) {
            callback(null,body);
          } else console.log(err);
        });
      },
      rooms: function(callback){
        rooms.view('rooms', 'list', function(err, body) {
          if (!err) {
            callback(null,body);
          } else console.log(err);
        });
      },
  },
  function(err, results) {
      console.log(results);
      res.render('settings', { module: results.module, rooms: results.rooms.rows });
  });
});

app.post('/:id', function(req, res){
  async.parallel({
      module: function(callback){
        modules.get(req.params.id, { revs_info: false }, function(err, body) {
          callback(null,body);
        });
      },
      rooms: function(callback){
        rooms.view('rooms', 'list', function(err, body) {
          callback(null,body);
        });
      },
  },
  function(err, results) {
    console.log(results);
    results.module.address = req.body.address;
    results.module.name = req.body.name;
    results.module.room = req.body.room;
    modules.insert(results.module, results.module.id, function (error, response) {
        if(!error) {
          console.log("it worked");
          res.redirect('/');
        } else {
          console.log("sad panda");
          res.redirect('/');
        }
    });
  });
});



/**
 * Start server
 */
/*
var server = https.createServer(options,app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
*/
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


/**
 * Socket.io
 */
var sio = io.listen(server);


sio.on('connection', function (socket) {
  socket.emit('news', { hello: 'xav' });
  socket.on('updateLight', function (data) {
    /*
    message.length = 0;
    message = [
                0x01,
                0xCC,
                data.lightVal
              ];
    serialPort.write(message);
    */
    console.log(data);

  });
  socket.on('updateLightInDB', function (data) {
    modules.get(data.id, { revs_info: false }, function(err, body) {
      if (!err) {
        if (data.dim != null) body.dim = data.dim;
        if (data.state != null) body.state = data.state;
        if (data.collapsed != null) body.collapsed = data.collapsed;
        modules.insert(body, body._id, function (error, response) {
          if(!error) {
            console.log("it worked");
          } else {
            console.log("sad panda");
          }
        });
      }
    });
  });
  socket.on('updateRGB', function (data) {
    console.log("new rgb values: ", data);
  });
});

serialPort.on("data", function (data) {
    console.log("here: "+data);
});