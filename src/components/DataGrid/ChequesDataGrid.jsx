import React, { useState } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
// import { useDemoData } from '@mui/x-data-grid-generator';
import {TableRow, Link, Button, Backdrop, CircularProgress, Stack, Typography, Grid, Box} from '@mui/material/';
import Paper from '@mui/material/Paper';
import { Delete, TenMp } from '@mui/icons-material';
import Cookies from "universal-cookie";
import ApiQuery from "../utils/apiQuery/apiQuery";
import dayjs from "dayjs";
import "dayjs/locale/es";
let apiQuery = new ApiQuery();
const cookies = new Cookies();

function buscarCantidad(dominio, contador) {
	// console.log(dominio);
	// console.log(contador);
	return contador.filter(item => item._id == dominio)[0].count
}

export default function BasicExampleDataGrid() {

	const [listaBloqueados, setListaBloqueados] = React.useState([])
	// Backdrop or Loading spinner
	const [open, setOpen] = useState(false);
	const [eliminar, setEliminar] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [userPermissions, setUserPermissions] = useState([]);
	const [userAccesos, setUserAccesos] = useState([]);

	const handleClose = () => {
	setOpen(false);
	};

	const columnsBloqueados = [
		{ field: 'cliente', headerName: 'Cliente', width: 230, flex:1.5, minWidth:130 },
		{ field: 'code', headerName: 'Código', width: 130, flex:0.8, minWidth:110 },
		{ field: 'fecha', headerName: 'Fecha', width: 130, flex:0.8, minWidth:110, type:"date", valueGetter: ({value}) => value && dayjs(value,'DD/MM/YYYY').toDate(), },
		{ field: 'banco', headerName: 'Banco', width: 130, flex:0.8, minWidth:110, renderCell:(params) => (params.row.banco == "otro" ? params.row.bancoOtro : params.row.banco)},
		{ field: 'monto', headerName: 'Monto', width: 130, flex:0.8, minWidth:110 },
		{ field: 'emisor', headerName: 'Emisor', width: 130, flex:0.8, minWidth:110 },
		{ field: 'estado', headerName: 'Estado', width: 130, flex:0.8, minWidth:110 },
		{ field: 'tipo', headerName: 'Tipo', width: 130, flex:0.8, minWidth:110 },
		];
	const columnsBloqueadosAdmin = [...columnsBloqueados,
		{ field: 'remove', headerName: 'Eliminar', width: 130, flex:0.8, headerAlign:'center', align:'center', renderCell:(params) => (		
			<Link sx={{cursor:"pointer", justifyContent:"center"}} onClick={() => removeElement(params.row._id)}>
				<Button color='error' variant='contained' sx={{minWidth:"fit-content", p:"6px"}}>
					<Delete />
				</Button>
			</Link>
		) },
	]

	React.useEffect(() => {
		let cancel = false;
		    setOpen(true);
		apiQuery.get(`/api/cheque/`)
		.then((res) => {
			if (cancel) return;
			setListaBloqueados(res.resultado);
			setOpen(false);
		})
		return () => { 
			  cancel = true;
			      setOpen(false);
		}
	      }, [eliminar])

	React.useEffect(() => {
		apiQuery.get(`/permisos`).then((respuesta) => {
			// console.log(respuesta);
			setIsAdmin(respuesta);
		});
	}, []);

	function removeElement(id) {
		setOpen(true);
		let cancel = false;
		apiQuery.delete(`/api/cheque/${id}`).then((response) => {
			if (cancel) return;
			// setLista(lista); // Para refrescar la tabla con la modificación
			setOpen(false);
			setEliminar(!eliminar);
		});
		return () => {
			cancel = true;
			setOpen(false);
			setEliminar(!eliminar);
		};
	}

  return (
	<Grid container spacing={3}>		
		<Grid item xs={12} sm={12}>
				{/* <Typography sx={{ mb:2 }} variant='h5'>Remitentes Bloqueados</Typography> */}
				<Box sx={{ height: 600, width: '100%' }}>
					<DataGrid rows={listaBloqueados} columns={(isAdmin || userAccesos.includes("desbloqueoSender")) ? columnsBloqueadosAdmin : columnsBloqueados} getRowId={(row) => row.code} 
						slots={{toolbar: GridToolbar,}} 
						slotProps={{toolbar: {showQuickFilter: true,},}}
						localeText={esES.components.MuiDataGrid.defaultProps.localeText}
						initialState={{
							sorting: {
							  sortModel: [{ field: 'estado', sort: 'desc' }],
							},
						      }}
					/>
				      	<Backdrop
						sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
						open={open}
						onClick={handleClose}
					>
						<CircularProgress color="inherit" />
					</Backdrop>
				</Box>
		</Grid>
	</Grid>
  );
}