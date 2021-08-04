import React from 'react';
import './App.css';
import { Button } from '@material-ui/core';
import Table from './table';
import Header from './header';
import axios from 'axios';
import {io} from 'socket.io-client';

const instance = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 6000
});

function App() {
  var socket = io("http://localhost:4000/");
  //const s = io("http://localhost:4000/camera/");
  /*
  socket.on("connection", (msg) => {
    console.log("Connected to the server!");
    //s.emit("camera", "online");
  })*/
  /*
  s.on("connection", (msg) => {
    console.log("Connected to the server!");
    //s.emit("camera", "online");
  })
  */
  //socket.disconnect();

  const f = async () => {
    const hello = await instance.post('/home', { withCredentials: true });
    console.log(hello);
  }
  const f1 = () => {
    
    //socket.disconnect();
    
    //const hello = await instance.post('/connect', { withCredentials: true });
    /*
    socket.on('connection', (newMessage) => {
      console.log(newMessage);
    });
    
    socket.on('msg', (newMessage) => {
      console.log(newMessage);
    });
    socket.on('send', (newMessage) => {
      console.log(newMessage);
    });
    */
  }
  const f2 = async () => {
    const hello = await instance.post('/send', { withCredentials: true });
    console.log(hello);
    socket.emit('take','picture',(msg)=>{
      console.log(msg);
    });
  }
  const f3 =  () => {
    socket.disconnect();
  }
  /*
      <Button variant = "outlined" color='primary' onClick = {() => f3()}>
        Disconnect
      </Button>
      <Button variant = "outlined" color='primary' onClick = {() => f1()}>
        Connect
      </Button>
      */
  return (
    <>
      <Header />
      <Button variant = "outlined" color='primary' onClick = {() => f()}>
        Hello
      </Button>
      <Button variant = "outlined" color='primary' onClick = {() => f1()}>
        Connect
      </Button>
      <Button variant = "outlined" color='primary' onClick = {() => f2()}>
        Send
      </Button>
      <Button variant = "outlined" color='primary' onClick = {() => f3()}>
        Disconnect
      </Button>
      <Table />
    </>
  );
}

export default App;


