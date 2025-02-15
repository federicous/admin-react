import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  Container,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import ApiQuery from "../utils/apiQuery/apiQuery";
// import FileInput from "../FileInput/FileInput";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import AlertUpdateModal from "../Alert/AlertUpdateModal"
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Seleccion from "../Formularios/Campos/Seleccion";
import SeleccionCliente from "../Formularios/Campos/SeleccionCliente";
import SeleccionCheque from "../Formularios/Campos/SeleccionCheque";
import Texto from "../Formularios/Campos/Texto";
import Fecha from "../Formularios/Campos/Fecha";
import dayjs from 'dayjs';

let apiQuery = new ApiQuery();

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

function capitalizeFirstLetter(string) {
  let cadena = string.toLowerCase();
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

export default function AddProduct() {
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [producto, setProducto] = useState({});
  const [camposObject, setCamposObject] = useState({
    fecha: dayjs(),
    // vencimiento: null,
    // tipo: "",
    // monto: "",
    // code:"",
    // vendedor:"",
    // cliente:"",
  });
  const [clienteLista, setClienteLista] = useState([""]);
  const [vendedorLista, setVendedorLista] = useState([""]);
  const [respuesta, setRespuesta] = useState("");
  const [listaFacturas, setListaFacturas] = useState([""])
  const [open, setOpen] = React.useState(false);
  const [listaCheques, setListaCheques] = React.useState([]);
  const [listaChequesFiltrada, setListaChequesFiltrada] = React.useState([]);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    apiQuery.get(`/api/users`)
    .then((res)=>{
      setClienteLista(res)
      setVendedorLista(["Leonel","Moises","Jeremias"])
    })
  }, [])

  React.useEffect(() => {
		let cancel = false;
		    // setOpen(true);
		apiQuery.get(`/api/facturaProveedor/`)
		.then((res) => {
			if (cancel) return;
			setListaFacturas(res.resultado);
			// setOpen(false);
		})
		return () => { 
			  cancel = true;
			      // setOpen(false);
		}
	      }, [])

        React.useEffect(() => {
          let cancel = false;
              setOpen(true);
          apiQuery.get(`/api/cheque/`)
          .then((res) => {
            if (cancel) return;
            setListaCheques(res.resultado);
            // console.log(res.resultado);
            setOpen(false);
          })
          return () => { 
              cancel = true;
                  setOpen(false);
          }
              }, [])
      
        const handleKey = (event) => {
          let valorCampo = event.target.value;
          let nombreCampo = event.target.name;
          let nuevoCampoObject = { ...camposObject };
          nuevoCampoObject[nombreCampo] = valorCampo;
          // setCamposObject({ ...nuevoCampoObject });
          if (nombreCampo == "code") {
            let facturaElegida = listaFacturas.filter((factura)=>factura.code==valorCampo);
            nuevoCampoObject["cliente"] = facturaElegida[0]["cliente"];
            nuevoCampoObject["vendedor"] = facturaElegida[0]["vendedor"];
            setListaChequesFiltrada(listaCheques.filter((item)=> item.cliente == facturaElegida[0]["cliente"]))
          }
          setCamposObject({ ...nuevoCampoObject });
          // console.log(nuevoCampoObject);
        };


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.currentTarget);
    const data = new FormData(event.currentTarget);
    // console.log(data);
    // return
    apiQuery
      // .putFormData(`/api/facturaCliente/`, data)
      .postFormData(`/api/pagos/`, data)
      .then((respuesta) => {
        // console.log(respuesta);
        setRespuesta(respuesta);
        if (respuesta.result == "ok") {
          setOpen(true);
        }
      })
      .catch((error) => {
        error = new Error();
      });
  };

  // const handleKey = (event) => {
  //   let valorCampo = event.target.value;
  //   let nombreCampo = event.target.name;
  //   let nuevoCampoObject = { ...camposObject };
  //   nuevoCampoObject[nombreCampo] = valorCampo;
  //   // setCamposObject({ ...nuevoCampoObject });
  //   if (nombreCampo == "code") {
  //     let facturaElegida = listaFacturas.filter((factura)=>factura.code==valorCampo);
  //     nuevoCampoObject["proveedor"] = facturaElegida[0]["proveedor"];
  //     // nuevoCampoObject["vendedor"] = facturaElegida[0]["vendedor"];
  //   }
  //   setCamposObject({ ...nuevoCampoObject });
  //   // console.log(nuevoCampoObject);
  // };

  const handleDelete = () => {
    console.log(`entro a delete`);
    apiQuery
      .delete(`/api/products/${producto._id ? producto._id : producto.id}`)
      .then((respuesta) => {
        console.log(respuesta);
        console.log(`apiqueryDelete`);
      })
      .catch((error) => {
        error = new Error();
      });
  };

  const traductor = (palabra) => {
    const Diccionario = {
      id: "ID",
      _id: "ID",
      name: "Nombre",
      code: "Codigo Factura",
      proveedor: "Proveedor",	
      fecha: "Fecha",
      monto: "Monto",
      vencimiento: "Vencimiento",
      vendedor:	"Vendedor",
      tipo:	"Tipo",
      medioDePago: "Medio de Pago",
      cheque: "Cheque o E-cheq",
    };
    return Diccionario[palabra];
  };

  return (
    // <ThemeProvider theme={theme}>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <AlertUpdateModal mostrar={open}/> */}

        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Elemento Agregado!
          </Alert>
        </Snackbar>

        <Typography component="h1" variant="h5">
          Pagos
        </Typography>

        <Box
          component="form"
          // noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid item md={6}  xs={12}>
              <Seleccion campo={"code"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={listaFacturas.map(factura => `${factura.code}`)}  required={true}  readOnly={false} type={"text"} variant={"outlined"}/>
            </Grid>
            {/* <Grid item md={6}  xs={12}>
              <Texto campo={"code"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} required={true}  readOnly={false} type={"text"} variant={"outlined"}/>
            </Grid> */}
            <Grid item md={6}  xs={12}>
              <Fecha campo={"fecha"}  traductor={traductor} handleKey={handleKey} camposObject={camposObject} />
            </Grid> 
            <Grid item md={6}  xs={12}>
              <Texto campo={"monto"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} required={true}  readOnly={false} type={"number"} variant={"outlined"}/>
            </Grid>
            <Grid item md={6}  xs={12}>
              <Seleccion campo={"medioDePago"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={["efectivo","cheque","transferencia","e-cheq"]} required={true}  readOnly={false} type={"number"} variant={"outlined"}/>
            </Grid>
            {((camposObject["medioDePago"] == "cheque") || (camposObject["medioDePago"] == "e-cheq")) ? 
            <>
              <Grid item md={12}  xs={12}>
                {/* <SeleccionCheque campo={"cheque"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={listaChequesFiltrada.length ? listaChequesFiltrada : listaCheques} required={true}  readOnly={false} type={"number"} variant={"outlined"} disabled={!listaChequesFiltrada.length}/> */}
                <SeleccionCheque campo={"cheque"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={listaCheques} required={true}  readOnly={false} type={"number"} variant={"outlined"} disabled={!listaCheques.length}/>
              </Grid>
            </> 
            : 
            <>
            </>}
            <Grid item md={12} xs={12}>
              <Texto campo={"proveedor"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={clienteLista} readOnly={true} variant={"filled"} required={false}/>
            </Grid>
            {/* <Grid item md={6}  xs={12}>
              <Fecha campo={"vencimiento"}  traductor={traductor} handleKey={handleKey} camposObject={camposObject} />
            </Grid>             */}
            {/* <Grid item md={6} xs={12}>
              <Texto campo={"vendedor"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={vendedorLista} readOnly={true} variant={"filled"} required={false}/>
            </Grid>             */}
            {/* <Grid item md={12} xs={12}>
              <Seleccion campo={"tipo"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={["factura", "pedido"]}  required={true}/>
            </Grid> */}
          </Grid>

          <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 2 }}>
            {/* <Button
              startIcon={<DeleteIcon />}
              color="error"
              type="button"
              fullWidth
              variant="contained"
              onClick={handleDelete}
              // disabled={botonSubmit}
            >
              Eliminar
            </Button> */}
            <Button
              startIcon={<EditIcon />}
              type="submit"
              fullWidth
              variant="contained"
            >
              Aplicar
            </Button>
          </Stack>

          <Grid container justifyContent="center">
            <Grid item>
              {/* <Link style={{ color: "inherit", display: "flex", flexDirection: "row", alignItems: "center",}}
                  to={`/home`} >
                    Ya tiene una cuenta? Iniciar sesión
                  </Link> */}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    // </ThemeProvider>
  );
}
