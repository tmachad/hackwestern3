var express = require("express");
var app = express();
var server = require("http").createServer(app);
io = require("socket.io").listen(server);

var players = [];
var numPlayers = 0;

class Vect {

	constructor(x, y) {
		setX(x);
		setY(y);
	}

	setX(x) {
		this.x = x;
	}

	setY(y) {
		this.y = y;
	}

	getX() {
		return this.x;
	}

	getY() {
		return this.y;
	}

	add(vect) {
		return new Vect(this.x + vect.x, this.y + vect.y);
	}
}

class Player {

	constructor(id, name, position, colour) {
		this.id = id;
		this.name = name;
		this.position = position;
		this.colour = colour;
	}

	setID(id) {
		this.id = id;
	}

	getID() {
		return this.id;
	}

	getPosition() {
		return this.position;
	}

	moveTo(position) {
		this.position = position;
	}

	move(dPosition) {
		moveTo(this.position.add(dPosition));
	}

}

server.listen(3000, function() {
	console.log("connected");
});

app.use(express.static(__dirname + '/public'));

io.on("connection", function(socket) {

	socket.playerID = numPlayers;
	io.emit("playerID", socket.playerID);
	players.push = new Player(socket.playerID, new Vect(0, 0), generateRandomColour());
	numPlayers = numPlayers + 1;

	setInterval(function(){ 
    	io.emit('update', JSON.stringify(players));
	}, 33);

	socket.on("player update", function(data) {
		var direction = JSON.parse(data);
		var hypotenuse = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
		var moveVect = new Vect(direction.getX()/hypotenuse, direction.getY()/hypotenuse);
		players[socket.playerID].move(moveVect);
	});

	socket.on("disconnect", function() {

		players.splice(socket.playerID, 1);
		for (player in players) {
			player.setID(socket.playerID - 1);
		}

		io.emit("user left", function() {
			io.emit('update', JSON.stringify(players));
		});
		
	});

});

function generateRandomColour() {
	return "#"+((1<<24)*Math.random()|0).toString(16);
}