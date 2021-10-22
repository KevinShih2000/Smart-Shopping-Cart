import './checkout.css';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';


function Copyright() {
  return (
    
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        Smart Shopping 
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

//var price ='199'
//var username = 'Cindy'

export default function Checkout({total, username}) {
  return (
    <Grid container component="main" direction="column" style = {{width: '100%'}} alignItems="flex-start" >
    <header className="App-header" >
      <div className='App-text'>
        {total}
      </div>
      
  
      <Box mt={30}>
        <Copyright />
      </Box>
    </header>
      </Grid>
    
  );
}
