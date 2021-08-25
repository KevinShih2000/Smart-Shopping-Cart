const express = require('express');
const app = express();
//const app_cam = express();
const http = require('http');
//const cam_port = process.env.CAM_PORT || 5000;
const port = process.env.PORT || 4000;
const httpServer = http.createServer(app);
const cors = require('cors');
const path = require("path");
const fs = require('fs');

require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const tf = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const toUint8Array = require('base64-to-uint8array');

//const mongoose = require('mongoose');
//const apiRouter = require('./routes/api');
const router = express.Router();

//require('dotenv').config();

var sockets = [];
var cameras = {};
var objs = [];
var preobjs = [];
var state;
var add = [];
var remove = [];
var id;
var imgs = [
    'images/apple.jfif',
    'images/banana.jfif',
    'images/scissor.jfif'
]
const contents = fs.readFileSync(imgs[0], {encoding: 'base64'});

let model;
let ready = false;

(async () => {
    model = await cocoSsd.load();
    ready = true;
    console.log("Model ready...");
})()

const socketio = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        credentials: true
    }
});

socketio.on('connection', (socket) => {
    console.log("Client connected! ID: ", socket.id);
    socket.on('disconnect', (reason) => {
        console.log('Disconnect');
        if(id === socket.id) {
            id = null;
            objs = [];
            preobjs = [];
            console.log('Camera disconnected');
        }
    })
    socket.on("camera", () => {
        console.log("Camera Online!");
        cameras[socket.id] = socket;
        id = socket.id;
    })
    socket.on("take", async () => {
        console.log("Picture request");
        if(id){
            cameras[id].emit("takeP", () => {
                console.log("Requesting Camera", id);
            })
        }
        else{
            obj = await obj_detect(contents);
            console.log("obj", obj);
            socketio.emit("imageR", contents, obj);
        }
    })
    socket.on("image", async (image) => {
        console.log("Image received");
        console.log("image: ", image);
        preobjs = objs;
        objs = await obj_detect(image);
        console.log(objs);
        if (objs.length !== preobjs.length) {
            if (objs.length > preobjs.length) {
                state = 1;
            }
            else {
                state = 2;
            }
            cameras[id].emit("object", state);
        }
        add = objs.filter(x => !preobjs.includes(x));
        remove = preobjs.filter(x => !objs.includes(x));
        socketio.emit("imageR", image, objs, add, remove);
    })
})

app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(router);
//app.use('/api', apiRouter);
//app.set('socketio', socketio);
//app.set('socket_cam', socket_cam);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

httpServer.listen(port, () => {
    console.log("Server is listening on port", port);
})

// object detection
const obj_detect = async (image) => {
    if(!ready){
        return null;
    }
    const imageArray = toUint8Array(image);
    const tensor3d = tf.node.decodeJpeg( imageArray, 3);
    const predictions = await model.detect(tensor3d);
    //console.log(predictions);
    return predictions;
}


// router

router.post('/home', async (req, res, next) => {
    try{
        res.json({
            status: 'success',
            msg: 'Hello!',
        });
    }
    catch (error) {
        res.status(400).json({
            status: 'failed',
        });
        return;
    }
});

router.post('/send', async (req, res, next) => {
    try{
        
        res.json({
            status: 'OK',
        });
        
    }
    
    catch (error) {
        res.status(400).json({
            status: 'failed',
        });
        return;
    }
});