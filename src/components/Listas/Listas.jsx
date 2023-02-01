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
} from "@mui/material";
import { Link } from "react-router-dom";
import { localidades } from "../utils/localidades";
import ApiQuery from "../utils/apiQuery/apiQuery";
import FileInputList from "../FileInput/FileInputList";
import TableUpload from "../Table/TableUpload"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

let apiQuery = new ApiQuery();

let sitecnia = "//SITECNIA"
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Desarrollado por "}
      <Link to={`/home`} color="inherit">
        {sitecnia}
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

let tekbondCampos = ["code", "linea", "contenido", "presentacion", "color", "unidades", "usd", "pvpusd", "iva",];
let bremenCampos = ["name", "code", "price", "iva", "origin", "description"];
let kantonCampos = ["name", "code", "price", "iva", "pricepack", "description"];
let sinparCampos = ["name", "code", "price", "iva", "ofertaUno", "ofertaDos", "ventaMinima"];

const campos = (lista) => {
  if (lista == "tekbond") {
    return tekbondCampos;
  } else if (lista == "bremen") {
    return bremenCampos;
  } else if (lista == "kanton") {
    return kantonCampos;
  } else if (lista == "sinpar"){
    return sinparCampos;
  }
};

function capitalizeFirstLetter(string) {
  let cadena = string.toLowerCase();
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

export default function AddProduct() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [provincia, setProvincia] = React.useState("");
  const [localidadArray, setLocalidadArray] = React.useState([]);
  const [localidad, setLocalidad] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [apellido, setApellido] = React.useState("");
  const [correo, setCorreo] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [calle, setCalle] = React.useState("");
  const [altura, setAltura] = React.useState("");
  const [cuit, setCuit] = React.useState("");
  const [ferreteria, setFerreteria] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [botonSubmit, setBotonSubmit] = React.useState(true);
  const [passwordError, setPasswordError] = React.useState(false);
  const [producto, setProducto] = useState({});
  const [navList, setNavList] = React.useState([]);
  const [brand, setBrand] = React.useState([]);
  const [categoria, setCategoria] = useState("");
  const [lista, setLista] = useState("");
  const [iva, setIva] = useState("");
  const [resultado, setResultado] = useState({});
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
    setResultado({})
  };

  useEffect(() => {
    let cancel = false;
    apiQuery
      .get(`/api/categorias/${lista}/label`)
      .then((respuesta) => {
        if (cancel) return;
        setNavList([...respuesta].filter(Boolean));
      })
      .catch((error) => {
        error = new Error();
      });
    return () => {
      cancel = true;
    };
  }, [lista]);

  useEffect(() => {
    let cancel = false;
    apiQuery
      .get(`/api/categorias/lista`)
      .then((respuesta) => {
        if (cancel) return;
        setBrand([...respuesta]);
      })
      .catch((error) => {
        error = new Error();
      });
    return () => {
      cancel = true;
    };
  }, []);

  const handleCategoria = (event) => {
    setCategoria(event.target.value);
  };

  const handleIva = (event) => {
    setIva(event.target.value);
  };

  const handleLista = (event) => {
    setLista(event.target.value);
  };

  React.useEffect(() => {
    let array = localidades.filter((item) =>
      item.provincia.nombre.match(new RegExp(`${provincia}`, "gi"))
    );
    let uniq = [...new Set(array)];
    setLocalidadArray(uniq);
    // console.log(localidades.filter((item)=> item.provincia.nombre.match(new RegExp(`${provincia}`,'gi'))));
  }, [provincia]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log([...data.entries()]
    //   // email: data.get('email'),
    //   // password: data.get('password'),
    // );
    let registro = {
      name: `${data.get("name")}`,
      code: data.get("code"),
      price: data.get("price"),
      iva: `${data.get("iva")}`,
      description: data.get("description"),
      label: data.get("label"),
      image: data.get("image"),
      linea: data.get("linea"),
      contenido: data.get("contenido"),
      presentacion: data.get("presentacion"),
      color: data.get("color"),
      origin: data.get("origin"),
      pricepack: data.get("pricepack"),
      usd: data.get("usd"),
      pvpusd: data.get("pvpusd"),
      unidades: data.get("unidades"),
      lista: data.get("lista"),
    };
    apiQuery
      .postFormData(`/api/listas/subir`, data)
      .then((respuesta) => {
        // console.log(respuesta);
        // console.log(respuesta.result);
        // console.log(respuesta.response);
        setResultado(respuesta)
        handleClose()
      })
      // .finally(()=>{
      //   document.getElementById("formLista").reset()
      // })
      .catch((error) => {
        error = new Error();
      });
  };


  // const handleKey = (event) => {
  //   console.log(event.target.value);
  //   console.log(event.target.name);
  // };

  React.useEffect(() => {
    if (
      nombre &&
      apellido &&
      correo &&
      password &&
      repeatPassword &&
      calle &&
      altura &&
      cuit &&
      ferreteria &&
      telefono &&
      provincia &&
      localidad
    ) {
      setBotonSubmit(false);
    } else {
      setBotonSubmit(true);
    }
  }, [
    nombre,
    apellido,
    correo,
    password,
    repeatPassword,
    calle,
    altura,
    cuit,
    ferreteria,
    telefono,
    provincia,
    localidad,
  ]);

  React.useEffect(() => {
    if (repeatPassword && password != repeatPassword) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  }, [password, repeatPassword]);

  const isEmailValid = (email) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const isBetween = (length, min, max) =>
    length < min || length > max ? false : true;

  const isPasswordSecure = (password) => {
    // const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    return re.test(password);
  };

  const isNumber = (number, min) => {
    const re = new RegExp(`^[0-9]{${min},}$`);
    return re.test(number);
  };

  const traductor = (palabra) => {
    const Diccionario = {
      id: "ID",
      _id: "ID",
      name: "Nombre",
      code: "Codigo",
      codigobarra: "Codigo de Barra",
      linea: "Linea",
      contenido: "Contenido",
      presentacion: "Presentacion",
      color: "Color",
      unidades: "Unidades",
      usd: "Precio USD",
      pvpusd: "Precio Venta USD",
      reftekbond: "Referencia Tekbond",
      tekbondcodigo: "Tekbond Codigo",
      label: "Categoria",
      origin: "Origen",
      iva: "iva",
      price: "Precio",
      pricepack: "Precio Pack",
      stock: "Stock",
      description: "Descripcion",
      ofertaUno: "Oferta I",
      ofertaDos: "Oferta II",
      ventaMinima: "Venta minima",
      lista: "Lista",
      marca: "Marca",
      image: "Imagen",
      timestamp: "timestamp",
      uuid: "uuid",
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
        <Typography component="h1" variant="h5">
        Modificar Lista
        </Typography>
        <Box
          component="form"
          // noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
          id="formLista"
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl variant="outlined" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Lista *
                </InputLabel>
                <Select
                  required
                  fullWidth
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={lista}
                  onChange={handleLista}
                  label={traductor("lista")}
                  name="lista"
                  sx={{ width: "100%" }}
                >
                  {brand
                    .sort(function (a, b) {
                      if (a > b) {
                        return 1;
                      }
                      if (a < b) {
                        return -1;
                      }
                      // a must be equal to b
                      return 0;
                    })
                    .map((item) => (
                      <MenuItem key={item} value={item}>
                        {item.toUpperCase()}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            {!lista.length ? (
              <></>
            ) : (
              <>
                {(() => {
                  if (["bremen","kanton","buloneria bremen","sinpar"].find(element => element==lista)) {
                    return (
                      <>
                        <Grid item xs={12}>
                          <FileInputList />
                        </Grid>
                      </>
                    );
                  } 
                  return (
                    <>
                      <Grid item xs={12}>
                        <FormControl variant="outlined" sx={{ width: "100%" }}>
                          <InputLabel id="demo-simple-select-outlined-label">
                            Categoria *
                          </InputLabel>
                          <Select
                            required
                            fullWidth
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={categoria}
                            onChange={handleCategoria}
                            label="Categoría"
                            name="label"
                            sx={{ width: "100%" }}
                          >
                            {navList
                              .sort(function (a, b) {
                                if (a > b) {
                                  return 1;
                                }
                                if (a < b) {
                                  return -1;
                                }
                                // a must be equal to b
                                return 0;
                              })
                              .map((item) => (
                                <MenuItem key={item} value={item}>
                                  {capitalizeFirstLetter(item)}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FileInputList />
                      </Grid>
                    </>
                  );
                })()}
              </>
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            // disabled={botonSubmit}
            onClick={handleToggle}
          >
            Agregar
          </Button>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
            onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Grid container justifyContent="center">
            <Grid item>
              {/* <Link style={{ color: "inherit", display: "flex", flexDirection: "row", alignItems: "center",}}
                 to={`/home`} >
                  Ya tiene una cuenta? Iniciar sesión
                </Link> */}
              {(Object.keys(resultado).length === 0 || (resultado.response.result=="error")) ? (
                ""
              ) : (
                <>
                  <Typography sx={{ mt: 4 }}>
                  Productos actualizados: {`${resultado.response.length}`}
                  </Typography>
                  <TableUpload products={resultado.response}/>
                </>
              )}

            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ my: 4 }} />
    </Container>
    // </ThemeProvider>
  );
}
