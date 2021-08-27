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
import no_item from './no_item.jfif';

function App() {
  const instance = axios.create({
    baseURL: "",
    timeout: 60000
  });
  const [ws, setWs] = useState(null);
  const [image, setImage] = useState(null);
  const [object, setObject] = useState([]);
  const [add, setadd] = useState(null);
  const [remove, setremove] = useState(null);

  useEffect(() => {
    if (ws) {
        return;
    }
    const socket = io("/");
    //const socket = io("http://localhost:4000");
    socket.on('imageR', (image, objs, add, remove) => {
      console.log(objs);
      setObject(objs);
      setImage(image);
      setadd(add);
      setremove(remove);
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

  return (
    <>
      <Header />
      {/*<Button variant = "outlined" color='primary' onClick = {() => f()}>
        Hello
      </Button> 
      <Button variant = "outlined" color='primary' onClick = {() => f2()}>
        Send
      </Button>
      */}
      <Typography variant="h6" >
          {}
      </Typography>
      <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
        <Grid item xs={12}>
          {image ? <img id = "image" src = {`data:image/jpg;base64,${image}`} style = {{height: 180, width: 250}} />
           : <img id = "image" src = {no_item} style = {{height: 180, width: 250}} />}
        </Grid>
        <Grid item xs={12}>
          <Table obj = {object} />
        </Grid>
      </Grid>
    </>
  );
}
//<Table />
export default App;


