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
import Texto from "../Formularios/Campos/Texto";
import Fecha from "../Formularios/Campos/Fecha";
import dayjs from 'dayjs';

let apiQuery = new ApiQuery();

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

// Agregar campos SIN EL LABEL
// let tekbondCampos = [
//   "lista",
//   "code",
//   "linea",
//   "contenido",
//   "presentacion",
//   "color",
//   "unidades",
//   "usd",
//   "pvpusd",
//   "iva",
//   "oferta",
//   "precioOferta",
//   "novedades",
// ];
// let bremenCampos = [
//   "lista",
//   "code",
//   "name",
//   "price",
//   "iva",
//   "origin",
//   "description",
//   "oferta",
//   "precioOferta",
//   "novedades",
// ];
// let kantonCampos = [
//   "lista",
//   "code",
//   "name",
//   "price",
//   "iva",
//   "pricepack",
//   "description",
//   "oferta",
//   "precioOferta",
//   "novedades",
// ];
// let buloneriaBremenCampos = [
//   "lista",
//   "code",
//   "name",
//   "price",
//   "iva",
//   "unidades",
//   "rosca",
//   "cabeza",
//   "punta",
//   "oferta",
//   "precioOferta",
//   "novedades",
//   // "terminacion",
// ];
// let sinparCampos = [
//   "name",
//   "lista",
//   "code",
//   "price",
//   "iva",
//   "ofertaUno",
//   "ofertaDos",
//   "ventaMinima",
//   "oferta",
//   "precioOferta",
//   "novedades",
// ];
// let coltecCampos = [
//   "name",
//   "lista",
//   "code",
//   "price",
//   "usd",
//   "iva",
//   "unidades",
//   "presentacion",
//   "oferta",
//   "precioOferta",
//   "novedades",
// ];
// let brmElectroCampos = [
//   "name",
//   "lista",
//   "code",
//   "price",
//   "iva",
//   "linea",
//   "codigobarra",
//   "oferta",
//   "precioOferta",
//   "novedades",
// ];
// let interquim = [
//   "name",
//   "lista",
//   "code",
//   "price",
//   "iva",
//   "oferta",
//   "precioOferta",
//   "novedades",
// ];

// const campos = (lista) => {
//   if (lista == "tekbond") {
//     return tekbondCampos;
//   } else if (lista == "bremen") {
//     return bremenCampos;
//   } else if (lista == "kanton") {
//     return kantonCampos;
//   } else if (lista == "buloneria bremen") {
//     return buloneriaBremenCampos;
//   } else if (lista == "sinpar") {
//     return sinparCampos;
//   } else if (lista == "coltec") {
//     return coltecCampos;
//   } else if (lista == "brm electro") {
//     return brmElectroCampos;
//   } else if (lista == "interquim") {
//     return interquim;
//   }
// };

function capitalizeFirstLetter(string) {
  let cadena = string.toLowerCase();
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

// let facturaCliente = ["name","code","lista","description"];
// let facturaCliente = ["cliente",	"fecha",	"code",	"monto",	"vencimiento",	"vendedor",	"tipo"];
let proveedorLista = ["bremen",	"kanton",	"brm electro", "interquim", "coltec", "sinpar"];
// let facturaClienteSelect = ["cliente","tipo"];

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
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // useEffect(() => {
  //   let cancel = false;
  //   apiQuery
  //     .get(`/api/product/${id}`)
  //     .then((respuesta) => {
  //       if (cancel) return;
  //       // respuesta["iva"]=Number(respuesta["iva"].replace(/%/g,""))
  //       setProducto(respuesta);
  //       setCamposObject(respuesta);
  //       console.log(respuesta);
  //       setLista(respuesta.lista);
  //       apiQuery
  //         .get(`/api/categorias/${respuesta.lista}/label`)
  //         .then((respuesta) => {
  //           console.log(respuesta);
  //           if (cancel) return;
  //           setNavList([...respuesta].filter(Boolean));
  //         })
  //         .catch((error) => {
  //           error = new Error();
  //         });
  //     })
  //     .catch((error) => {
  //       error = new Error();
  //     });
  //   return () => {
  //     cancel = true;
  //   };
  // }, []);

  useEffect(() => {
    apiQuery.get(`/api/users`)
    .then((res)=>{
      setClienteLista(res)
      setVendedorLista(["Leonel","Moises","Jeremias"])
    })
  }, [])


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event.currentTarget);
    const data = new FormData(event.currentTarget);
    // console.log(data);
    // return
    apiQuery
      // .putFormData(`/api/facturaCliente/`, data)
      .postFormData(`/api/facturaProveedor/`, data)
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

  const handleKey = (event) => {
    let valorCampo = event.target.value;
    let nombreCampo = event.target.name;
    let nuevoCampoObject = { ...camposObject };
    nuevoCampoObject[nombreCampo] = valorCampo;
    setCamposObject({ ...nuevoCampoObject });
    // console.log(nuevoCampoObject);
  };

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
      __v: "Version",
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
          Factura Proveedor
        </Typography>

        <Box
          component="form"
          // noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
              {/* <Seleccion campo={"cliente"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={clienteLista.map(usuario => `${capitalizeFirstLetter(usuario.name)} - ${usuario.email}`)}  required={true}/> */}
              {/* <Seleccion campo={"cliente"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={clienteLista.map(usuario => `${usuario.email}`)}  required={true}/> */}
              <Seleccion campo={"proveedor"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={proveedorLista}  required={true}/>
            </Grid>
            <Grid item md={6}  xs={12}>
              <Texto campo={"code"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} required={true}  readOnly={false} type={"text"} variant={"outlined"}/>
            </Grid>
            <Grid item md={6}  xs={12}>
              <Fecha campo={"fecha"}  traductor={traductor} handleKey={handleKey} camposObject={camposObject} />
            </Grid>  
            <Grid item md={6}  xs={12}>
              <Texto campo={"monto"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={["opcion4", "opcion2"]} required={true}  readOnly={false} type={"number"} variant={"outlined"}/>
            </Grid>
            <Grid item md={6}  xs={12}>
              <Fecha campo={"vencimiento"}  traductor={traductor} handleKey={handleKey} camposObject={camposObject} />
            </Grid>            
            {/* <Grid item md={12} xs={12}>
              <Seleccion campo={"vendedor"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={vendedorLista}  required={true}/>
            </Grid>             */}
            <Grid item md={12} xs={12}>
              <Seleccion campo={"tipo"} traductor={traductor} handleKey={handleKey} camposObject={camposObject} listaOpciones={["factura", "pedido"]}  required={true}/>
            </Grid>
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
