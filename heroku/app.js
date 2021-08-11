const express = require('express');
const app = express();
const app_cam = express();
const http = require('http');
const cam_port = process.env.CAM_PORT || 5000;
const port = process.env.PORT || 4000;
const httpServer = http.createServer(app);
const cors = require('cors');
var path = require("path");
//const mongoose = require('mongoose');
//const apiRouter = require('./routes/api');
const router = express.Router();

//require('dotenv').config();

var sockets = {};
var cameras = {};
var id;

/*
const socket_cam = require('socket.io')(
    app_cam.listen(cam_port, () => {
        console.log("Camera server is listening on port", cam_port);
    })
);

socket_cam.of('/camera').on("connection", (camera) => {
    console.log("Camera connected! ID: ", camera.id);
    camera.join(camera.id);
    camera.on('disconnect', (reason) => {
        console.log('leave room ' + camera.id)
        camera.leave(camera.id);
    })
})
*/

const socketio = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        credentials: true
    }
});
/*
socketio.of('camera').on('connection', (camera) => {
    console.log("Camera connected! ID: ", camera.id);
    camera.on('disconnect', (reason) => {
        console.log('Disconnect');
    })
    camera.on('camera',(data)=>{
        console.log("Camera Online!");
        cameras[camera.id] = camera;
        id = camera.id;
    })
    
})
*/

socketio.on('connection', (socket) => {
    console.log("Client connected! ID: ", socket.id);
    socket.on('disconnect', (reason) => {
        console.log('Disconnect');
    })
    socket.on("camera", () => {
        console.log("Camera Online!");
        cameras[socket.id] = socket;
        id = socket.id;
    })
    socket.on("take", () => {
        console.log("Picture request");
        if(cameras){
            cameras[id].emit("takeP", () => {
                console.log("Requesting Camera", id);
            })
        }
    })
    socket.on("image", (image) => {
        console.log("Image received");
        socketio.sockets.emit("imageR", () => {
            console.log("image: ", image);
        })
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
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

httpServer.listen(port, () => {
    console.log("Server is listening on port", port);
})

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