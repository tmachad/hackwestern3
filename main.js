$(function() {

	var socket = io.connect();

	socket.on("new message", function(data) {
		$("p").text(data);
	});

	alert("Hello World");

});