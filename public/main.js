
function generateJSON() {
	var json = '{ "players": [';

	for(var i = 0; i < 10; i++) {
		var x = Math.random() * window.innerWidth;
		var y = Math.random() * window.innerHeight;
		json += '{ "name":"' + 0 + '" , "x":"' + x + '", "y":"' + y + '", "colour": "#FF0000" },'
	}
	json = json.slice(0, -1);
	json += ']}';
	return json;
}

var socket = io.connect();

$( document ).ready(function() {

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
	
	socket.on("new message", function(data) {
		//$("p").text(data);
	});

	var intervalVar = setInterval(gameLoop, frameDelay);
	
	function gameLoop() {
		socket.emit('player update', movement);
	}

	var canvas = $( "#game" )[0];
	var ctx = canvas.getContext("2d");
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

  	var id = 0;
  	var camera = new Vect(0,0);


  	var OGgameState = generateJSON();
	var gameState = JSON.parse(OGgameState);
  	(function renderLoop(i) {
  		setTimeout(function() {
			render(ctx, canvas, id, camera, gameState.players);
			camera.setX(camera.getX()+1);
			camera.setY(camera.getY()+1);
  			if(--i) {
  				renderLoop(i);
  			}
  		}, 33);
  	})(1000);
    
});

function render(ctx, canvas, id, camera, gameState) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//ctx.lineWidth = 2;
	ctx.strokeStyle="#000000";
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	//ctx.lineWidth = 1;
	for( var i = 0; i < gameState.length; i++ ) {
		player = gameState[i];

		//var size = parseInt(player.size);
		var size = 20;
		var x = parseInt(player.x) - size/2;
		var y = parseInt(player.y) - size/2;

		if(i != id) {
			x -= camera.getX();
			y -= camera.getY();
		}

		//ctx.save();
		//ctx.translate(camera.x, camera.y);

		ctx.fillStyle = player.colour;
		ctx.beginPath();
		ctx.arc(x, y, size, 0, 2 * Math.PI);
		ctx.fill();

		ctx.strokeStyle = "#000000";
		ctx.arc(x, y, size, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();

		//ctx.restore();
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
}
