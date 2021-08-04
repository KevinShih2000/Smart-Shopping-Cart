var io = require('socket.io-client');
var socket = io.connect('http://localhost:4000/');
var fs = require('fs');
//var cam = require('raspicam');
//var c = new cam({ mode: "photo", output: "photo.jpg", w: 1920, h: 1080 });

socket.on("connect", () => {
    console.log("Connected to the server!");
    socket.emit("camera", "online");
})

socket.on("takeP", (mes, fn) => {
    console.log("Received picture request");
    fn("picture taked");

});