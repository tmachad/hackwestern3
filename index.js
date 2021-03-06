var express = require("express");
var app = express();
var server = require("http").createServer(app);
io = require("socket.io").listen(server);

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

var players = [];
var numPlayers = 0;

var clients =[];

io.on("connection", function(socket) {

	clients.push(socket.id);

	var me = null;
	var playerID = null;

	socket.on("create player", function(name) {
		playerID = numPlayers;
		//io.emit("playerID", playerID);
		io.to(clients[clients.length - 1]).emit("playerID", playerID);
		players.push(new Player(playerID, name, new Vect(100, 100), generateRandomColour()));
		//console.log(new Player(playerID, name, new Vect(100, 100), generateRandomColour()));
		//me = players[players.length - 1]; 
		numPlayers++;
		//console.log(numPlayers);
	});

	setInterval(function(){ 
		//console.log(players);
    	io.emit('update', JSON.stringify(players));
	}, 33);

	socket.on("player update", function(data) {
		//if (me != null)
		//{
			var direction = JSON.parse(data);
			console.log(direction);
			var moveVect = new Vect(direction.x, direction.y);
			//var hypotenuse = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
			//var moveVect = new Vect(direction.x/hypotenuse, direction.y/hypotenuse);

			if (direction.id != null) {

				for (var i = 0; i < players.length; i++) {
					if (players[i].getID() == direction.id)
					{	
						me = players[i];
					}
				}

				if ((me.getPosition().getX() + moveVect.getX()) > 5000)
					moveVect.setX(5000 - me.getPosition().getX());
				else if ((me.getPosition().getX() + moveVect.getX()) < 0)
					moveVect.setX(0 - me.getPosition().getX());
				if ((me.getPosition().getY() + moveVect.getY()) > 5000)
					moveVect.setY(5000 - me.getPosition().getY());
				else if ((me.getPosition().getY() + moveVect.getY()) < 0)
					moveVect.setY(0 - me.getPosition().getY());

				me.move(moveVect);
			}
		//}
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