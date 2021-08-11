import React from 'react';
import { useEffect, useState, useRef } from 'react';
import {io} from 'socket.io-client'
import './App.css';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Table from './table';
import Header from './header';
import axios from 'axios';


function App() {
  const instance = axios.create({
    baseURL: "",
    timeout: 60000
  });
  const [ws, setWs] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (ws) {
        return;
    }
    const socket = io("/");
    socket.on('imageR', (image) => {
      console.log(image);
      setImage(image);
    });
    setWs(socket);
    return () => {
      if (ws) {
          ws.disconnect();
      }
    }
  }, [ws]);

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
    ws.emit('take', () => {
      console.log('take request...');
    });
  }
  const f3 =  () => {
    ws.disconnect();
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
      <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
        <Grid item xs={2}>
          <img id = "image" src = {image}/>
        </Grid>
        <Grid item xs={9}>
          <Table />
        </Grid>
      </Grid>
    </>
  );
}
//<Table />
export default App;


