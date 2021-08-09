import React from 'react';
import './App.css';
import Table from './table';
import Header from './header';
import Grid from '@material-ui/core/Grid';


function App() {
  return (
    <>
      <Header />
        <Grid container direction="row" justifyContent="flex-end" alignItems="center" spacing={3}>
          <Grid item xs={2}>

          </Grid>
          <Grid item xs={9}>
            <Table />
          </Grid>
        </Grid>
    </>
  );
}

export default App;


