var express = require("express");
var app = express();
var server = require("http").createServer(app);
io = require("socket.io").listen(server);

server.listen(3000);

app.get("/", function)