import './checkout.css';
import logo from './login_img.png';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';


function Copyright() {
  return (
    
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit">
        HPS Smart Shopping 
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

var price ='199'
var username = 'Cindy'

export default function Checkout({price, username}) {
  return (
    <Grid container component="main" direction="column" maxWidth="xs=12" alignItems="flex-start" >
    <header className="App-header" >
      <div className='App-text'>
        {price}
      </div>
      <div className='App-text2'>
        Dear {username},
      </div>
      <div className='App-text3'>
        Thank you.
      </div>
      <div className='App-text4'>
        Please come again.
      </div>
      <img src={logo} width='80'/>
      <Box mt={1}>
        <Copyright />
      </Box>
    </header>
      </Grid>
    
  );
}


