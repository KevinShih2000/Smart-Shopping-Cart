import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'name',
    label: 'Name',
    minWidth: 50,
    align: 'center',
  },
  {
    id: 'Price',
    label: 'Price',
    minWidth: 50,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'Catagory',
    label: 'Catagory',
    minWidth: 50,
    align: 'center',
  },
];

function createData(name, Price, Catagory) {
  return { name, Price, Catagory };
}

var item = ['cup','bowl','apple','scissors','banana'];

var item_price = {
  'cup' : 80,
  'bowl' : 105,
  'apple' : 30,
  'scissors' : 49,
  'banana' : 50
};

var item_calor = {
  'cup' : 'X',
  'bowl' : 'X',
  'apple' : '136',
  'scissors' : 'X',
  'banana' : '150'
};



const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

const StyledTableCell = withStyles((theme) => ({
    head: {
      fontSize: 20,
    },
    body: {
      fontSize: 18,
    },
}))(TableCell);

const StyledTableCell2 = withStyles((theme) => ({
    body: {
      fontSize: 30,
      minWidth: 180,
      backgroundColor: '#D0D0D0',
    },
}))(TableCell);

export default function StickyHeadTable({labels, price, cat, total, setTotal, setState, setcurState, record, setRecord}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  var rows = [];

  for (var i=0; i<labels.length; i++){
      rows[i] = createData(labels[i], price[i], cat[i]);
  }
  
  function total_fun(items) {
    return items.map(({ Price }) => Price).reduce((sum, i) => sum + i, 0);
  }

  total = total_fun(rows);
  setTotal(total);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table" >
          <TableHead> 
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    //console.log(value);
                    return (
                      <StyledTableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Table>
        <TableBody>
            <TableRow>
                <StyledTableCell></StyledTableCell>
            </TableRow>
            <TableRow>
                <StyledTableCell2  align='center'>--- Total = ${total} ---</StyledTableCell2>
            </TableRow>
        </TableBody>
      </Table>

      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Box display="flex" justifyContent="center" style={{ width: '100%' }} bgcolor="background.paper">
        <Button variant = "contained" onClick = {() => {
          setState(2);
          setcurState(2);
          var today = new Date();
          var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' '+today.getHours()+":"+today.getMinutes();
          var currecord = {
            "time" : date,
            "price" : total
          }
          setRecord([...record, currecord]);
        }} style = {{marginBottom: 10, marginTop: 10}} class="checkoutbutton">
          CHECKOUT
        </Button>
      </Box>
    </Paper>
  );
}
