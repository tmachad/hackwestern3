$(function() {

	var socket = io.connect();
	var oldPos = {x:0, y:0};
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
});