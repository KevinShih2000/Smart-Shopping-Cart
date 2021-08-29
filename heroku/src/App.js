import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {io} from 'socket.io-client'
import './App.css';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Table from './table';
import Header from './header';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import no_item from './no_item.jfif';
import SignIn from './login';
import Checkout from './checkout';

const useStyles = makeStyles((theme) => ({
  list: {
      maxHeight: 180,
      backgroundColor: theme.palette.background.paper,
  },
}))

function App() {
  const instance = axios.create({
    baseURL: "",
    timeout: 60000
  });
  const [ws, setWs] = useState(null);
  const [image, setImage] = useState(null);
  const [object, setObject] = useState([]);
  const [add, setadd] = useState([
    {
      class: '123',
    },{
      class: 'apple',
    }
  ]);
  const [remove, setremove] = useState([
    {
      class: '456',
    },{
      class: 'pineapple',
    }
  ]);
  const [state, setState] = useState(0);
  const [username, setUsername] = useState(0);
  const [total, setTotal] = useState(0);
  const classes = useStyles();

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

  if (state === 0) {
    return ( <SignIn setState = {setState} setUsername = {setUsername} /> );
  }
  else if (state === 1) {
    return (
      <>
        <Header username = {username} />
        {/*<Button variant = "outlined" color='primary' onClick = {() => f()}>
          Hello
        </Button> 
        <Button variant = "outlined" color='primary' onClick = {() => f2()}>
          Send
        </Button>
        */}
        
        <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1} style = {{marginTop: 10}}>
          <Grid item xs={7}>
            {image ? <img id = "image" src = {`data:image/jpg;base64,${image}`} style = {{height: 180, width: 250}} />
            : <img id = "image" src = {no_item} style = {{height: 180, width: 250}} />}
          </Grid>
          <Grid xs={5}>
          { add.length === 0 ? <></> : 
            <List
              className={ classes.list }
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader color = "primary" id="nested-list-subheader">
                  Items Added
                </ListSubheader>
              }
            >
              {add.map((x) => (
                <ListItem button>
                    {x.class}
                </ListItem>
                )
              )}
            </List>
          }
          { remove.length === 0 ? <></> : 
            <List
              className={ classes.list }
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader style = {{color: 'red'}} id="nested-list-subheader">
                  Items Removed
                </ListSubheader>
              }
            >
              {remove.map((x) => (
                <ListItem button>
                  {x.class}
                </ListItem>
                )
              )}
            </List>
          }
          </Grid>
          <Grid item xs={12}>
            <Table obj = {object} total = {total} setTotal = {setTotal} setState = {setState} />
          </Grid>
        </Grid>
      </>
    );
  }
  else {
    return( <Checkout total = {total} username = {username} /> );
  }
  
}
//<Table />
export default App;


