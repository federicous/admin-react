import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ApiQuery from "../utils/apiQuery/apiQuery";
let apiQuery = new ApiQuery();

function ccyFormat(num) {
	let numFloat = parseFloat(num)
	      return `${numFloat.toFixed(2)}`;
}

export default function DenseTable({products}) {
	const [dolar, setDolar] = React.useState(0)

	React.useEffect(() => {
		let cancel = false;
		apiQuery.get(`/api/dolar`)
			    .then((respuesta) => {
		  if (cancel) return;
		  setDolar(Number(respuesta.dolar));
			    })
		return () => { 
		  cancel = true;
		}
	      }, [])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell align="right">Lista</TableCell>
            <TableCell align="right">Precio (Pesos)</TableCell>
            <TableCell align="right">Mas detalles</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((item) => (
            <TableRow
              key={item.code}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.code}
              </TableCell>
              <TableCell align="right">{item.lista}</TableCell>
              <TableCell align="right">{item.precioConIva ? ccyFormat(item.precioConIva) : (item.price ? ccyFormat(item.price) : (item.usd ? ccyFormat(item.usd*dolar) : "")) }</TableCell>
              <TableCell align="right">{`${
                      [item.name,item.color,item.linea,item.presentacion,`${(item.unidades!="0" && item.lista=="buloneria bremen") ? (`${item.unidades} unidades`) : ""}`,`${item.contenido ? (""+item.contenido) : ""}`].filter(Boolean).join(" | ")
                      }`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
