var socket = io.connect();

$(window).resize(function(){
    var canvas = $( "#game" )[0];
	var ctx = canvas.getContext("2d");
	resizeCanvas(ctx);
});

function resizeCanvas(ctx) {
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;
}

function dropPixel(number) {
	return (0.5 + number) << 0;
}

$( document ).ready(function() {

	var username = prompt("Enter a username", "Username");
	socket.emit('create player', username);
	
	var movement = {x:0.0, y:0.0, id:null};
	var frameDelay = 33;
	
	
	window.addEventListener("mousemove", function (event) {
		movement.x = event.pageX - $(window).width() / 2.0;
		movement.y = event.pageY - $(window).height() / 2.0;

		var length = Math.sqrt(Math.pow(movement.x, 2) + Math.pow(movement.y, 2));

		//convert to unit vector
		movement.x = (movement.x / length)*2.5;
		movement.y = (movement.y / length)*2.5;

		movement.id = id;
		
	});

	var intervalVar = setInterval(gameLoop, frameDelay);
	
	function gameLoop() {
		$('#debug').text(movement);
		socket.emit('player update', JSON.stringify(movement));
		//JSON.parse(JSON.stringify(movement));
	}

	var canvas = $( "#game" )[0];
	var ctx = canvas.getContext("2d");
	resizeCanvas(ctx);
    
    var id = 0;

  	socket.on("playerID", function(data) {
		id = data;
		console.log(id);
	});

  	socket.on("update", function(data) {
		var players = [];
		var parsed = JSON.parse(data);
		for (var player in parsed) {
			players.push(parsed[player]);
		}
		//console.log(players);
		render(ctx, canvas, id, players);
	});

});

function render(ctx, canvas, myId, gameState) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//ctx.lineWidth = 2;
	ctx.strokeStyle = "#000000";
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	var centre = new Vect(canvas.width / 2, canvas.height / 2);
 
 	var me = new Vect(0,0);
 	for( var i = 0; i < gameState.length; i++ ) {
 		//console.log(gameState[i]);
 		if(gameState[i].id == myId) {
 			//console.log(gameState[i]);
 			me = new Vect(gameState[i].position.x, gameState[i].position.y);
 		}
	}
	//console.log(me);
	var deltaMe = centre.subtract(me);
	//console.log(me);
	//console.log(deltaMe)

 	//ctx.lineWidth = 1;

	for( var i = 0; i < gameState.length; i++ ) {
		player = gameState[i];
		var size = 20;
		var pos = new Vect(parseInt(player.position.x) - size/2, parseInt(player.position.y) - size/2);

		//console.log(pos);
 		pos = pos.add(deltaMe);
 		//console.log(pos);
 		//console.log("-------------");

		ctx.fillStyle = player.colour;
		ctx.beginPath();
		ctx.arc(dropPixel(pos.getX()), dropPixel(pos.getY()), size, 0, 2 * Math.PI);
		//ctx.arc(dropPixel(100), dropPixel(100), 20, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.arc(dropPixel(pos.getX()), dropPixel(pos.getY()), size, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();

	}
	
}

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

	getX(x) {
		return this.x;
	}

	getY(y) {
		return this.y;
	}

	add(vect) {
		return new Vect(this.x + vect.x, this.y + vect.y);
	}

	subtract(vect) {
		return new Vect(this.x - vect.x, this.y - vect.y);
	}

	toString() {
		return "(" + this.x + ", " + this.y + ")";
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
