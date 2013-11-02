
var express = require("express");
var app = express();
var port = 3700;

app.set('views', __dirname + '/tpl');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get("/", function(req, res){
  res.render('page');
});

app.use(express.static(__dirname + '/public'));
var io = require('socket.io').listen(app.listen(port));


// Assign an ID for the user
var idCount = 0;
function assignId(){
	return idCount++;
}

// Socket connection
io.sockets.on('connection', function(socket) {
  
  socket.emit('userID', {ID : assignId() })

  socket.emit('firstCoords', { mouseX: 500, mouseY: 500 });
  
  socket.on('reposition', function(data) {
    console.log(data);
    socket.broadcast.emit('moveCursor', data)
  });

});

console.log("Listening on port " + port);
