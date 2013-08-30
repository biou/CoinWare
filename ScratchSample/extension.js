var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.use(express.static(path.join(__dirname, '..')));
});

var server = http.createServer(app);


var io = require('socket.io').listen(server);

var scratchext = require('./scratchext/scratchext');
var ext = null;

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', function (socket) {
	socket.emit('news', {});
	if (ext === null) {
		ext = scratchext.create({
		    blocks: {
		        gameReady: function (s) {
		        	io.sockets.emit('gameReady', { });
		            console.log('game is ready');           
		        },
		        gameEnded: function(wongame, score) {
		        	io.sockets.emit('gameEnded', { 'wongame': wongame, 'score': score });
		        	console.log('gameEnded: wongame '+wongame+', score '+score);

		        }
		    },
		    onInit: function() {
		    	io.sockets.emit('gameLoaded', { });
		    }
		});
	}

  socket.on('gameStart', function (data) {
	ext.vars.difficulty = data.difficulty;
	ext.vars.start = true;   	
  	console.log('game started');  	
  });
});


