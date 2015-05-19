var util = require('util');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('/index.html');
});

var players = 0;// only for count the amount of players online 
var id = 0; // one basic id generator

io.on('connection', function(socket){
	players++;
	id++;
	setTimeout(function(){
		socket.emit('user connected', {playerId: id});// only for the connected user, send de object playerId
		io.emit('count', {players: players});
	}, 1500);

	socket.on('disconnect', function(){
		players--;
		io.emit('count', {players: players});
	});

	socket.on('update', function(data){
		socket.broadcast.emit('updated', data);
	});

});



server.listen(8000, function(){
	console.log("testing this thing in the port 80 mf");
});