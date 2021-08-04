const express = require('express');
const router = express.Router();

//require('dotenv').config();

var sockets = {};

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

router.post('/connect', async (req, res, next) => {
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

router.post('/send', async (req, res, next) => {
    try{
        const io = req.app.get('socketio');
        io.emit("send", "send msg");
        //console.log(io);
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

module.exports = router;