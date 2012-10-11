
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

//app.get('/', routes.index);

app.get('/', function(req, res){
  modules.view('modules', 'modules', function(err, body) {
    if (!err) {
      res.render('index', { data: body.rows });
      /*
      body.rows.forEach(function(doc) {
        console.log(doc.value);
      });
      */
    }
  });
});

app.get('/colour', module.colour);

app.get('/settings/:id', function(req, res){
  modules.get(req.params.id, { revs_info: false }, function(err, body) {
    if (!err) {
      res.render('settings', { data: body });
    } else console.log(err);
  });
});




/*
app.post('/:id', function(req, res){
  console.log("updating id: ",req.body.id);

  modules.get(req.params.id, { revs_info: false }, function(err, body) {
    if (!err) {
      body.address = req.body.address;
      body.name = req.body.name;
      modules.insert(body, body.id, function (error, response) {
          if(!error) {
            console.log("it worked");
            res.redirect('/');
          } else {
            console.log("sad panda");
            res.redirect('/');
          }
      });
    } else console.log(err);
  });
});
*/

/*
app.post('/:id', function(req, res){
  console.log("updating id: ",req.body.id);

  async.parallel({
      one: function(callback) {
          modules.get(req.params.id, { revs_info: false }, function(err, body) {
            callback(null,body);
      }),
      one: function(callback) {
          modules.get(req.params.id, { revs_info: false }, function(err, body) {
            callback(null,body);
      }),
  },
  function(err, results) {
      console.log(results.one.id);
      console.log(results.two.id);
  });
});
*/

app.post('/:id', function(req, res){
  async.parallel({
      one: function(callback){
        modules.get(req.params.id, { revs_info: false }, function(err, body) {
          callback(null,body);
        });
      },
      two: function(callback){
        rooms.view('rooms', 'list', function(err, body) {
          callback(null,body);
        });
      },
  },
  function(err, results) {
      console.log(results);
      res.redirect('/');
  });
});



/*
// start secure server
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
  socket.emit('news', { hello: 'world' });
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
  socket.on('updateRGB', function (data) {
    console.log("new rgb values: ", data);
  });
});

serialPort.on("data", function (data) {
    console.log("here: "+data);
});