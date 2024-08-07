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
import FileInput from "../FileInput/FileInput";

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
let buloneriaBremenCampos = [
  "code",
  "name",
  "price",
  "iva",
  "unidades",
  "rosca",
  "cabeza",
  "punta",
  "oferta",
  "precioOferta",
  // "terminacion",
];
let sinparCampos = [
  "name",
  "code",
  "price",
  "iva",
  "ofertaUno",
  "ofertaDos",
  "ventaMinima",
  "oferta",
  "precioOferta",
];

const campos = (lista) => {
  if (lista == "tekbond") {
    return tekbondCampos;
  } else if (lista == "bremen") {
    return bremenCampos;
  } else if (lista == "kanton") {
    return kantonCampos;
  } else if (lista == "buloneria bremen") {
    return buloneriaBremenCampos;
  } else if (lista == "sinpar") {
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
        setBrand([...respuesta].filter(Boolean));
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
    console.log(registro);
    console.log(data);
    // return
    console.log(`apiquery0`);
    apiQuery
      .postFormData(`/api/products/`, data)
      .then((respuesta) => {
        console.log(respuesta);
        console.log(`apiquery22`);
      })
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
      lista: "Lista",
      marca: "Marca",
      image: "Imagen",  
      rosca: "Rosca",
      cabeza: "Cabeza",
      punta: "Punta",    
      oferta: "Oferta",
      precioOferta: "Precio Oferta",
      ofertaUno: "Oferta I",
      ofertaDos: "Oferta II",
      ventaMinima: "Venta minima",
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
          Agregar producto
        </Typography>
        <Box
          component="form"
          // noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
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
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
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
                  let columnas = [];
                  for (const key of campos(lista)) {
                    if (key == "iva") {
                      columnas.push(
                        <Grid
                          key={key}
                          item
                          md={key == "name" || key == "code" ? 12 : 6}
                          xs={12}
                        >
                          <FormControl
                            variant="outlined"
                            sx={{ width: "100%" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              IVA *
                            </InputLabel>
                            <Select
                              required
                              fullWidth
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              value={iva}
                              onChange={handleIva}
                              label="iva"
                              name="iva"
                              sx={{ width: "100%" }}
                            >
                              <MenuItem value="21">21</MenuItem>
                              <MenuItem value="10.5">10.5</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      );

                      continue;
                    }
                    columnas.push(
                      <Grid
                        key={key}
                        item
                        md={key == "name" || key == "code" ? 12 : 6}
                        xs={12}
                      >
                        <TextField
                          required={
                            [
                              "code",
                              "description",
                              "unidades",
                              "contenido",
                              "lista",
                              "precioOferta",  
                              "ofertaUno",
                              "ofertaDos",
                              "oferta",
                              "ventaMinima",
                            ].includes(key)
                              ? false
                              : true
                            }
                          fullWidth
                          // disabled={key=="_id"}
                          name={key}
                          label={traductor(key)}
                          type={(["code","price","usd","pvpusd","unidades","pricepack"].includes(key)) ? "number" : "text" }
                          id={key}
                          // autoComplete="new-password"
                          // onChange={handleKey}
                          // value={element}
                          // placeholder={`${element}`}
                        />
                      </Grid>
                    );
                  }
                  return (
                    <>
                      {columnas}
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
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
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
                        <FileInput />
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
          >
            Agregar
          </Button>
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
      <Copyright sx={{ my: 4 }} />
    </Container>
    // </ThemeProvider>
  );
}
