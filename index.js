var express = require("express");
var app = express();
var server = require("http").createServer(app);
io = require("socket.io").listen(server);

var players = [];
var numPlayers = 0;

class Vect {

	constructor(x, y) {
		this.x = x;
		this.y = y;
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

	setName(name) {
		this.name = name;
	}

	getName() {
		return this.name;
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
		this.position = this.position.add(dPosition);
	}

}

server.listen(3000, function() {
	console.log("connected");
});

app.use(express.static(__dirname + '/public'));

io.on("connection", function(socket) {

	var me = null;
	var playerID = null;

	socket.on("create player", function(name) {
		playerID = numPlayers;
		io.emit("playerID", playerID);
		players.push(new Player(playerID, name, new Vect(100, 100), generateRandomColour()));
		me = players[players.length - 1]; 
		numPlayers = numPlayers + 1;
	});

	setInterval(function(){ 
		console.log(players);
    	io.emit('update', JSON.stringify(players));
	}, 33);

	socket.on("player update", function(data) {
		if (me != null)
		{
			var direction = data;
			var hypotenuse = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
			var moveVect = new Vect(direction.x/hypotenuse, direction.y/hypotenuse);
			if ((moveVect.getX() + 20 / 2) > 1000) {
				moveVect.setX(1000 - 20 / 2);
			} else if((moveVect.getX() - 20 / 2) < 0) {
				moveVect.setX(20/2);
			}
			if ((moveVect.getY() + 20 / 2) > 1000) {
				moveVect.setY(1000 - 20 / 2);3
			} else if((moveVect.getY() - 20 / 2) < 0) {
				moveVect.setY(20/2);
			}
			me.move(moveVect);
		}
	});

	socket.on("disconnect", function() {
		for (var i = 0; i < players.length; i++) {
			if (players[i].getID() == playerID)
			{
				players.splice(i, 1);
			}
		}
	});

});

function generateRandomColour() {
	return "#"+((1<<24)*Math.random()|0).toString(16);
}