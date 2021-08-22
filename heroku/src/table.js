import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


const columns = [
  { id: 'name', label: 'Name', minWidth: 170 },
  {
    id: 'Price',
    label: 'Price',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'Calories',
    label: 'Calories',
    minWidth: 170,
    align: 'center',
    format: (value) => value.toLocaleString('en-US'),
  },
];

function createData(name, Price, Calories) {
  return { name, Price, Calories };
}

var item_price = {
  'cup' : 80,
  'bowl' : 105,
  'apple' : 30,
  'scissors' : 49
};

var item_calor = {
  'cup' : 'X',
  'bowl' : 'X',
  'apple' : '136',
  'scissors' : 'X'
};

const rows = [];



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

export default function StickyHeadTable({obj}) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  for (var i=0; i<obj.length; i++){
    rows[i] = createData(obj[i].class, item_price[obj[i].class], item_calor[obj[i].class])
  }
  
  function total_fun(items) {
    return items.map(({ Price }) => Price).reduce((sum, i) => sum + i, 0);
  }
  const total = total_fun(rows);

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
    </Paper>
  );
}