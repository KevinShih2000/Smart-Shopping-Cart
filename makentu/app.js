import mongo from './mongo.js';
import express from 'express';
const app = express();
//const app_cam = express();
import http from 'http';
//const cam_port = process.env.CAM_PORT || 5000;
const port = process.env.PORT || 4000;
const httpServer = http.createServer(app);
import cors from 'cors';
import path from "path";
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/*
require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const tf = require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const toUint8Array = require('base64-to-uint8array');
*/

//import apiRouter from './routes/api';
const router = express.Router();

import dotenv from 'dotenv-defaults';
dotenv.config();

var sockets = [];
var cameras = {};
var objs = [];
var preobjs = [];
var state;
var id;

var text = fs.readFileSync("./label.txt").toString();
var labels = text.split("\n");

var labels = new Array(91).fill(0);
var price = new Array(91).fill(0);
var cat = new Array(91).fill(0);
var res_items;
var res_price;
var res_cat;
var idx;

var text1 = fs.readFileSync("./label.txt").toString();
var rlabels = text1.split("\n");
for(let j=0; j<rlabels.length; j++){
  labels[rlabels[j].split(" ")[0]] = rlabels[j].split(" ")[1];
}
 
var text2 = fs.readFileSync("./price.txt").toString();
var rprice = text2.split("\n");
for(let j=0; j<rprice.length; j++){
  price[rprice[j].split(" ")[0]] = rprice[j].split(" ")[1];
}

var text3 = fs.readFileSync("./cat.txt").toString();
var rcat = text3.split("\n");
for(let j=0; j<rcat.length; j++){
  cat[rcat[j].split(" ")[0]] = rcat[j].split(" ")[1];
}

/*
var imgs = [
    'images/no_item.jfif',
    'images/apple.jfif',
    'images/banana.jfif',
    'images/scissor.jfif'
]
*/

//const contents = fs.readFileSync(imgs[0], {encoding: 'base64'});

//var item = ['cup','bowl','apple','scissors','banana'];

//let model;
//let ready = false;

/*
(async () => {
    model = await cocoSsd.load();
    ready = true;
    console.log("Model ready...");
})()
*/

import { Server } from 'socket.io';
const socketio = new Server(httpServer, {
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
    /*
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
        //console.log("image: ", image);
        preobjs = objs;
        objs = await obj_detect(image);
        console.log(objs);
        if (objs.findIndex(obj => obj.class === "person") == -1) {
            objs = objs.filter(x => item.includes(x.class));
            if (objs.length !== preobjs.length) {
                if (objs.length > preobjs.length) {
                    state = 1;
                }
                else {
                    state = 2;
                }
                cameras[id].emit("object", state);
            }
            socketio.emit("imageR", image, objs);
        }
        else {
            objs = preobjs;
        }
        
    })
    */
    socket.on("result", async (msgstr) => {
        let msg = JSON.parse(msgstr);
        console.log("msg received", msg);
        console.log(msg.length);
        res_items = new Array(msg.length).fill(0);
        res_price = new Array(msg.length).fill(0);
        res_cat = new Array(msg.length).fill(0)
        for(let i=0; i<msg.length; i++){
            idx = msg[i] + 1;
            res_items[i] = labels[idx];
            res_price[i] = parseInt(price[idx], 10);
            res_cat[i] = cat[idx].trim();
        }
        socketio.emit("items", JSON.stringify(res_items), JSON.stringify(res_price), JSON.stringify(res_cat));
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
    const predictions = await model.detect(tensor3d, 20, 0.2);
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