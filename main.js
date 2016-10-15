$(function() {

	var socket = io.connect();

	socket.on("new message", function(data) {
		$("p").text(data);
	});s

	alert("Hello World");

});