
function generateJSON() {
	var json = '{ "players": [';

	for(var i = 0; i < 10; i++) {
		var x = Math.random() * window.innerWidth;
		var y = Math.random() * window.innerHeight;
		var size = (Math.random() * 30) + 10;
		json += '{ "id":"' + i + '" , "position": {"x":"' + x + '", "y":"' + y + '"}, "size": "' + size + '", "colour": "#FF0000" },'
	}
	json = json.slice(0, -1);
	json += ']}';
	return json;
}

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
	
	var movement = {x:0.0, y:0.0};
	var frameDelay = 1000/30;
	
	
	window.addEventListener("mousemove", function (event) {
		movement.x = event.pageX - $(window).width() / 2.0;
		movement.y = event.pageY - $(window).height() / 2.0;

		var length = Math.sqrt(Math.pow(movement.x, 2) + Math.pow(movement.y, 2));

		//convert to unit vector
		movement.x = movement.x / length;
		movement.y = movement.y / length;
		
	});

	var intervalVar = setInterval(gameLoop, frameDelay);
	
	function gameLoop() {
		$('#debug').text(JSON.stringify(movement));
		socket.emit('player update', JSON.stringify(movement));
		JSON.parse(JSON.stringify(movement));
	}

	var canvas = $( "#game" )[0];
	var ctx = canvas.getContext("2d");
	resizeCanvas(ctx);

  	var id = 0;
    
  	socket.on("PlayerID", function(data) {
		id = data;
	});

  	socket.on("update", function(data) {
		var players = JSON.parse(data);
		render(ctx, canvas, id, players.players);
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
		if(gameState[i].id == myId) {
			me = new Vect(gameState[i].x, gameState[i].y);
		}
	}
	var deltaMe = centre.subtract(me);

	//ctx.lineWidth = 1;
	for( var i = 0; i < gameState.length; i++ ) {
		player = gameState[i];
		var size = parseInt(player.size);
		var pos = new Vect(parseInt(player.position.x) - size/2, parseInt(player.position.y) - size/2);
		pos = pos.add(deltaMe);

		ctx.fillStyle = player.colour;
		ctx.beginPath();
		ctx.arc(dropPixel(pos.getX()), dropPixel(pos.getY()), size, 0, 2 * Math.PI);
		ctx.fill();

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
