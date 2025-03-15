import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import "dayjs/locale/es";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbar,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import {provincias} from "../utils/provincias"
import {localidades} from "../utils/localidades"
import ApiQuery from "../utils/apiQuery/apiQuery";
import {config} from "../../config/config";
import EmailCell from "../CustomCell/EmailCell";
import {Snackbar, Alert} from '@mui/material';

let apiQuery = new ApiQuery();

// const roles = ['Market', 'Finance', 'Development'];
// const randomRole = () => {
//   return ["asd","pepe"];
// };
// const randomRole = () => {
// 	const randomIndex = Math.floor(Math.random() * roles.length);
// 	return roles[randomIndex];
//       }

// const initialRows = [
//   {
//     id: 1111,
//     name: "pepe",
//     age: 25,
//     joinDate: dayjs(),
//     role: randomRole(),
//   },
//   {
//     id: 2222,
//     name: "jose",
//     age: 36,
//     joinDate: dayjs(),
//     role: randomRole(),
//   },
//   {
//     id: 3333,
//     name: "juan",
//     age: 19,
//     joinDate: dayjs(),
//     role: randomRole(),
//   },
// ];

function compararObjetos(obj1, obj2) {
  // const diferencias = {};
  // // Combina las claves de ambos objetos para iterar sobre todas las propiedades
  // const todasLasClaves = new Set([...Object.keys(objeto1), ...Object.keys(objeto2)]);

  // todasLasClaves.forEach(clave => {
  //   if (objeto1[clave] !== objeto2[clave]) {
  //     diferencias[clave] = objeto2[clave]; // Toma el valor del objeto2
  //   }
  // });
  // return diferencias;

  let resultado = {};

  Object.keys(obj2).forEach(clave => {
      if (obj1[clave] !== obj2[clave]) {
          resultado[clave] = obj2[clave];
      }
  });

  return resultado;
}

function generarNumeroAleatorio(cantidadDeCifras) {
  const minimo = Math.pow(10, cantidadDeCifras - 1); // Calcula el valor mínimo (ej: 100 para 3 cifras)
  const maximo = Math.pow(10, cantidadDeCifras) - 1; // Calcula el valor máximo (ej: 999 para 3 cifras)
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;
}

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const _id = generarNumeroAleatorio(6);
    const nuevoCliente = true;
    setRows((oldRows) => [
      ...oldRows,
      { _id, nuevoCliente: nuevoCliente , name: '', email: '', ferreteria: '',vendedor: '',localidad: '',provincia:'',address:'',cuit:'',phone:'',password:'', isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [_id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <div style={{ width: '100%' }}>
        <Box
          sx={{   
          display: "flex",
          flexDirection: "row",
          justifyContent: 'space-between'
          }} 
          >
          <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
            Agregar usuario
          </Button>
          <GridToolbar />
          {/* <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
            Add record
          </Button>
          <GridToolbar /> */}
          <GridToolbarQuickFilter />
        </Box>
      </div>
    </GridToolbarContainer>
  );
}

export default function FullFeaturedCrudGrid() {
//   const [rows, setRows] = React.useState(initialRows);
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [eliminar, setEliminar] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userPermissions, setUserPermissions] = React.useState([]);
  const [userAccesos, setUserAccesos] = React.useState([]);
  const [listaClientes, setListaClientes] = React.useState([])
  const [localidadArray, setLocalidadArray] = React.useState([]);
  const [provincia, setProvincia] = React.useState('');
  const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({
    nuevoCliente: false,
        });
  const [vendedor, setVendedor] = React.useState('');
  const [localidad, setLocalidad] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [nombreError, setNombreError] = React.useState(false);
  const [apellido, setApellido] = React.useState('');
  const [apellidoError, setApellidoError] = React.useState(false);
  const [correo, setCorreo] = React.useState('');
  const [correoError, setCorreoError] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [repeatPasswordError, setRepeatPasswordError] = React.useState(false);
  const [calle, setCalle] = React.useState('');
  const [calleError, setCalleError] = React.useState(false);
  const [altura, setAltura] = React.useState('');
  const [alturaError, setAlturaError] = React.useState(false);
  const [cuit, setCuit] = React.useState('');
  const [cuitError, setCuitError] = React.useState(false);
  const [ferreteria, setFerreteria] = React.useState('');
  const [ferreteriaError, setFerreteriaError] = React.useState(false);
  const [telefono, setTelefono] = React.useState('');
  const [telefonoError, setTelefonoError] = React.useState(false);
  const [botonSubmit, setBotonSubmit] = React.useState(true);
  const [passwordError, setPasswordError] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [openSnackBarError, setOpenSnackBarError] = React.useState(false);
  
  const handleClickSnackBar = () => {
    setOpenSnackBar(true);
  };
  const handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleClickSnackBarError = () => {
    setOpenSnackBarError(true);
  };
  const handleCloseSnackBarError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBarError(false);
  };

  const registrar = (usuario) => {
    console.log(usuario);
    // return
    delete usuario.nuevoCliente
    delete usuario._id

    apiQuery.postSimple(`/api/users`, usuario)
    .then((res) => {
      // setListaClientes(res);
      // setRows(res)
      console.log(res);		
      setOpen(false);
    })
  };

  const modificar = (usuario) => {
    console.log(usuario);
    // return
    delete usuario.nuevoCliente
    delete usuario.isNew
    apiQuery.put(`/api/users`, usuario)
    .then((res) => {
      // setListaClientes(res);
      // setRows(res)
      console.log(res);		
      setOpen(false);
    })
  };

  const eliminarUsuario = (usuario) => {
    console.log(usuario);
    // return
    apiQuery.deleteSimple(`/api/users`, usuario)
    .then((res) => {
      // setListaClientes(res);
      // setRows(res)
      console.log(res);		
      setOpen(false);
    })
  };

  const handleClose = () => {
  setOpen(false);
  };

  function capitalizeFirstLetter(string) {
    let cadena = string.toLowerCase()
    return cadena.charAt(0).toUpperCase() + cadena.slice(1);
  }

  const getLocalidadesOptions = (provincia) => {
    let array = localidades.filter((item)=> item.provincia.nombre.match(new RegExp(`${provincia}`,'gi'))).map(objeto => objeto.nombre)
    // console.log(provincia);    
    // console.log(array);    
    let uniq = [...new Set(array)];
    // console.log(uniq);    
    // setLocalidadArray(uniq)
    return uniq
    // return provincia
    //   ? localidades
    //       .filter((loc) => loc.provincia === provincia)
    //       .map((loc) => loc.nombre)
    //   : [];
  };

	const columnsBloqueados = [
		{ field: 'name', headerName: 'Cliente', width: 130, flex:0.8, minWidth:110, editable: true, },
		{ field: 'email', headerName: 'Email', width: 230, flex:1.5, minWidth:110, editable: true, },
		// { field: 'email', headerName: 'Email', width: 230, flex:1.5, minWidth:110, editable: true, renderCell:(params) => (<EmailCell value={params.row.email}  />)},
		// { field: 'fecha', headerName: 'Fecha', width: 130, flex:0.8, minWidth:110, type:"date", valueGetter: ({value}) => value && dayjs(value,'DD/MM/YYYY').toDate(), },
		{ field: 'ferreteria', headerName: 'Ferreteria', width: 130, flex:0.8, minWidth:110, editable: true, },
		{ field: 'vendedor', headerName: 'Vendedor', width: 130, flex:0.8 , minWidth:110, editable: true,
      type: 'singleSelect',
      valueOptions: ['Leonel', 'Moises'],
      valueGetter: (params) => params.row.vendedor ? capitalizeFirstLetter(params.row.vendedor) : ""
    },
		{ field: 'provincia', headerName: 'Provincia', width: 130, flex:0.8 , minWidth:110, editable: true,
      type: 'singleSelect',
      valueOptions: provincias.sort(function (a, b) {
        if (a.iso_nombre > b.iso_nombre) {
          return 1;
        }
        if (a.iso_nombre < b.iso_nombre) {
          return -1;
        }
        return 0;
      }).map(objeto => objeto.iso_nombre),
      valueGetter: (params) => params.row.provincia ?? "",
    },
    { field: 'localidad', headerName: 'Localidad', width: 130, flex:0.8 , minWidth:110, /* editable: true, */
      valueGetter: (params) => params.row.localidad? params.row.localidad.toUpperCase() : "",
      type: 'singleSelect',
      valueOptions: (params) => getLocalidadesOptions(params.row.provincia).sort(function (a, b) {
          if (a > b) { return 1; }
          if (a < b) { return -1; }
          // a must be equal to b
          return 0;
        }),
      editable: (params) => Boolean(params.row.provincia), // Deshabilita si no hay provincia seleccionada
    },
		{ field: 'address', headerName: 'Dirección', width: 130, flex:0.8 , minWidth:110, editable: true,},
		{ field: 'cuit', headerName: 'Cuit', width: 130, flex:0.8 , minWidth:110, editable: true, type: "number"},
		{ field: 'phone', headerName: 'Tel', width: 130, flex:0.8 , minWidth:110, editable: true, type: "number"},
		{ field: 'descuento', headerName: 'Desc[%]', width: 130, flex:0.8 , minWidth:110, editable: true, type: "number", headerAlign:'center', align:'center'},
		{ field: 'isAdmin', headerName: 'Admin', width: 130, flex:0.8 , minWidth:110, editable: true, headerAlign:'center', align:'center',
      type: 'singleSelect',
      valueOptions: ['on', 'off'],
      valueGetter: (params) => params.row.isAdmin ? params.row.isAdmin : ""
    },
		{ field: 'nuevoCliente', headerName: 'nuevo', width: 130, flex:0.8 , minWidth:110, editable: true, headerAlign:'center', align:'center'},
		{ field: 'password', headerName: 'Clave', type: 'password', width: 130, flex:0.8 , minWidth:110, renderCell:(params) => ("**********"), editable: true, },
		{
			field: 'actions',
			type: 'actions',
			headerName: 'Acciones',
			width: 100,
			cellClassName: 'actions',
			getActions: ({ id }) => {
				// console.log(id);
				
				const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
				return [
				<GridActionsCellItem
					icon={<SaveIcon />}
					label="Save"
					sx={{
						color: 'primary.main',
					}}
					onClick={handleSaveClick(id)}
				/>,
				<GridActionsCellItem
					icon={<CancelIcon />}
					label="Cancel"
					className="textPrimary"
					onClick={handleCancelClick(id)}
					color="inherit"
				/>,
				];
				}

				return [
				<GridActionsCellItem
					icon={<EditIcon />}
					label="Edit"
					className="textPrimary"
					onClick={handleEditClick(id)}
					color="inherit"
				/>,
				<GridActionsCellItem
				icon={<DeleteIcon />}
				label="Delete"
				onClick={handleDeleteClick(id)}
				color="inherit"
				/>,
				];
		},
		},
		];
	const columnsBloqueadosAdmin = [...columnsBloqueados,
		// { field: 'remove', headerName: 'Eliminar', width: 130, flex:0.8, headerAlign:'center', align:'center', renderCell:(params) => (		
		// 	<Link sx={{cursor:"pointer", justifyContent:"center"}} onClick={() => removeElement(params.row._id)}>
		// 		<Button color='error' variant='contained' sx={{minWidth:"fit-content", p:"6px"}}>
		// 			<Delete />
		// 		</Button>
		// 	</Link>
		// ) },
	]

  React.useEffect(() => {
	let cancel = false;
	    setOpen(true);
	apiQuery.get(`/api/users/`)
	.then((res) => {
		if (cancel) return;
		setListaClientes(res);
		setRows(res)
		// console.log(res);		
		setOpen(false);
	})
	return () => { 
		  cancel = true;
		      setOpen(false);
	}
      }, [eliminar])

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
	// console.log(id);
	// console.log(rowModesModel);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    // console.log(rowModesModel);
    // console.log(GridRowModes.View);
	  // console.log([id]);    
  };

  const handleDeleteClick = (id) => () => {
    // console.log(rows.find((row) => row._id === id));
    const deletedRow = rows.find((row) => row._id === id)
    eliminarUsuario({...deletedRow})
    setRows(rows.filter((row) => row._id !== id));
    handleClickSnackBar()
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row._id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row._id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    // console.log(rows);
    setRows(rows.map((row) => (row._id === newRow._id ? updatedRow : row)));
    // console.log(rows);
    // console.log(updatedRow);
    if (updatedRow.name && updatedRow.email && updatedRow.password && updatedRow.address && updatedRow.cuit && updatedRow.ferreteria && updatedRow.phone && updatedRow.provincia && updatedRow.localidad && updatedRow.vendedor) {
      console.log(`COMPLETO`);
      if (updatedRow.nuevoCliente) {
        console.log(`REGISTRAR`);
        // delete updatedRow.nuevoCliente
        // delete updatedRow._id
        registrar({...updatedRow})
        handleClickSnackBar()
        // let filaOriginal = rows.filter((row) => row._id == updatedRow._id);
        // const diferencias = compararObjetos(filaOriginal[0], updatedRow);
        // diferencias._id = updatedRow._id
        // console.log(diferencias);
        // return updatedRow;
      } else {
        console.log(`MODIFICAR`);
        // delete updatedRow.nuevoCliente
        // delete updatedRow.isNew
        let filaOriginal = rows.filter((row) => row._id == updatedRow._id);
        const diferencias = compararObjetos(filaOriginal[0], updatedRow);
        diferencias._id = updatedRow._id        
        modificar(diferencias)
        handleClickSnackBar()
      }
    } else {
      console.log(`FALTAN`);  
      let filaOriginal = rows.filter((row) => row._id == updatedRow._id);
      handleClickSnackBarError()
      return filaOriginal;
    }
    let filaOriginal = rows.filter((row) => row._id == updatedRow._id);
    const diferencias = compararObjetos(filaOriginal[0], updatedRow);
    diferencias._id = updatedRow._id
    console.log(diferencias);
    
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

// ############################################################################
//                        VALIDACION DE LOS DATOS
// ############################################################################

  const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const isBetween = (length, min, max) => length < min || length > max ? false : true;

  const isPasswordSecure = (password) => {
  // const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    return re.test(password);
  };

  const isNumber = (number, min) => {
    const re = new RegExp(`^[0-9]{${min},}$`);
    return re.test(number);
  }

  function handleFirstName(e) {
    let firstName= e.target.value
    if (isBetween(firstName.length, 3, 25)) {
      setNombre(firstName)
      setNombreError(false)
    } else {
    setNombre('')
    setNombreError(true)
    }
  }

  function handleLastName(e) {
    let lastName= e.target.value
    if (isBetween(lastName.length, 3, 25)) {
      setApellido(lastName)
      setApellidoError(false)
    } else {
      setApellido('')
      setApellidoError(true)
    }
  }

  function handleEmail(e) {
    let email= e.target.value
    if (isEmailValid(email)) {
      setCorreo(email)
      setCorreoError(false)
    } else {
      setCorreo('')
      setCorreoError(true)
    }
  }

  function handlePassword(e) {
    let password= e.target.value
    if (isPasswordSecure(password)) {
      setPassword(password)
      setPasswordError(false)
    } else {
      setPassword('')
      setPasswordError(true)
    }
  }

  function handleRepeatPassword(e) {
    let password= e.target.value
      setRepeatPassword(password)
  }

  const handleProvincia = (event) => {
    setProvincia(event.target.value);
  };

  const handleLocalidad = (event) => {
    setLocalidad(event.target.value);
  };

  const handleVendedor = (event) => {
    setVendedor(event.target.value);
  };

  const handlePhone = (e) => {
    let telefono= e.target.value
    if (isNumber(telefono,10)) {
      setTelefono(telefono)
      setTelefonoError(false)
    } else {
    setTelefono('')
    setTelefonoError(true)
    }
  };

  const handleCuit = (event) => {
    let cuit= event.target.value
    if (isNumber(cuit,11)) {
      setCuit(cuit)
      setCuitError(false)
    } else {
    setCuit('')
    setCuitError(true)
    }
  };

  const handleFerreteria = (event) => {
    let ferreteria= event.target.value
    if (isBetween(ferreteria.length, 3, 130)) {
      setFerreteria(ferreteria)
      setFerreteriaError(false)
    } else {
    setFerreteria('')
    setFerreteriaError(true)
    }

  };

  const handleCalle = (event) => {
    let calle= event.target.value
    if (isBetween(calle.length, 3, 130)) {
      setCalle(calle)
      setCalleError(false)
    } else {
    setCalle('')
    setCalleError(true)
    }
  };

  const handleAltura = (event) => {
    let altura= event.target.value
    if (isBetween(altura.length, 1, 30)) {
      setAltura(altura)
      setAlturaError(false)
    } else {
    setAltura('')
    setAlturaError(true)
    }
  };


  return (
    <Box
      sx={{
        height: 650,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
	      getRowId={(row) => row._id} 
        // columns={columns}
	      columns={(isAdmin || userAccesos.includes("desbloqueoSender")) ? columnsBloqueadosAdmin : columnsBloqueados}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        columnVisibilityModel={columnVisibilityModel}
        slots={{ toolbar: EditToolbar }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, showQuickFilter: true, },
        }}
        // slots={{toolbar: GridToolbar}} 
        // slotProps={{toolbar: {showQuickFilter: true,},}}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        initialState={{
          sorting: {
            sortModel: [{ field: 'estado', sort: 'desc' }],
          },
        }}
      />
      <Snackbar open={openSnackBar} autoHideDuration={3000} onClose={handleCloseSnackBar}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Acción completada!
        </Alert>
      </Snackbar>
      <Snackbar open={openSnackBarError} autoHideDuration={4000} onClose={handleCloseSnackBarError}>
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Falta completar campos
        </Alert>
      </Snackbar>
    </Box>
  );
}
