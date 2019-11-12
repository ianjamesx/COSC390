//var net = new brain.NeuralNetwork();

/*

// TODO:
-projectiles
-train on projectile launches
*/

var express = require('express');
var app = express();
var serv = require('http').Server(app);

var nn = require('brainjs');

var io = require('socket.io')(serv, {

    pingInterval: 1000,
    pingTimeout: 120000,

});

app.get('/', function(req, res) {

    res.sendFile(__dirname + '/client/index.html');

});

app.use('/client', express.static(__dirname + '/client'));


io.sockets.on('connection', function(socket){

  socket.id = Math.random(); //random socket id
  console.log('connection made to server | id: ' + socket.id);

  //training net for this client connection
  var net = new nn.NeuralNetwork();

  var dxData = [], dyData = [];

  socket.on('pos', function(data){

    dxData.push(data.dx);
    dyData.push(data.dy);

    trainDirectionals(data.dx, data.dy, data.xc, data.yc, net);

    var test = net.run([data.dx, data.dy]);
    console.log('output: ');
    console.log(test);

  });

/*
  var trainInterval = setInterval(function(){

    avgData(dxData, dyData);
    trainDirectionals(data.dx, data.dy, data.xc, data.yc, net);

  }, 1000);
*/
});

function trainDirectionals(dx, dy, xc, yc, net){

  net.train(
    [
      {
        input: [dx, dy],
        output: [xc, yc]
      }
    ]);

}

serv.listen(8080);

console.log('file server online');
