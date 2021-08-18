import React from 'react';
import { useEffect, useState, useRef } from 'react';
import {io} from 'socket.io-client'
import './App.css';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Table from './table';
import Header from './header';
import axios from 'axios';
import { Height } from '@material-ui/icons';


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
    //const socket = io("/");
    const socket = io("http://localhost:4000");
    socket.on('imageR', (image, obj) => {
      console.log(obj);
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

  const f2 = async () => {
    const hello = await instance.post('/send', { withCredentials: true });
    console.log(hello);
    ws.emit('take', () => {
      console.log('take request...');
    });
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
      <Button variant = "outlined" color='primary' onClick = {() => f2()}>
        Send
      </Button>
      <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
        <Grid item xs={5}>
          <img id = "image" src = {`data:image/jpg;base64,${image}`} style = {{height: 400, width: 550}} />
        </Grid>
        <Grid item xs={7}>
          <Table />
        </Grid>
      </Grid>
    </>
  );
}
//<Table />
export default App;


