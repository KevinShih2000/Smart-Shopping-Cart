const cv = require('opencv4nodejs');
const io = require('socket.io-client');
const socket = io.connect('http://localhost:4000/');
const fs = require('fs');
//const cam = require('raspicam');
//const c = new cam({ mode: "photo", output: "photo.jpg", w: 1920, h: 1080 });

const vCap = new cv.VideoCapture(0);

socket.on("connect", () => {
    console.log("Connected to the server!");
    socket.emit("camera", "online");
})

socket.on("takeP", () => {
    console.log("Received picture request");
    const frame = vCap.read();
    const image = cv.imencode('.jpg', frame).toString('base64');
    socket.emit('image', image);
    console.log("picture taked");
});