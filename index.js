var express = require("express");
var app = express();
var server = require("http").createServer(app);
io = require("socket.io").listen(server);

server.listen(3000, function() {
	console.log("connected");
});

app.get("/", function(req, res) {
	res.sendfile(__dirname + "/index.html");
});

io.on("connection", function(socket) {

	//io.on("send message"), function(data) {
		//io.emit("new message", data);	
	//}
	io.emit("new message", "hello");

});