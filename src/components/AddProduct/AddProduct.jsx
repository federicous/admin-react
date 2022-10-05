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
import { Link, useNavigate } from "react-router-dom";
import { localidades } from "../utils/localidades";
import { config } from "../../config/config";
import axios from "axios";
import ApiQuery from "../utils/apiQuery/apiQuery";
import GetAppIcon from "@mui/icons-material/Image";
import FileInput from "../FileInput/FileInput";

let apiQuery = new ApiQuery();

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
        //SITECNIA
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

let tekbondCampos = [
  "code",
  "linea",
  "contenido",
  "presentacion",
  "color",
  "unidades",
  "usd",
  "pvpusd",
  "iva",
];

let bremenCampos = ["name", "code", "price", "iva", "origin", "description"];

let kantonCampos = ["name", "code", "price", "iva", "pricepack", "description"];

const campos = (lista) => {
  if (lista == "tekbond") {
    return tekbondCampos;
  } else if (lista == "bremen") {
    return bremenCampos;
  } else if (lista == "kanton") {
    return kantonCampos;
  }
};

function capitalizeFirstLetter(string) {
  let cadena = string.toLowerCase();
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

export default function SignUp() {
  let navigate = useNavigate();
  //   const {id} = useParams()
  let id = "62fe8cdb80972ad19001c927";
  // let id = "62fe8cf380972ad19001e1c5"

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
  // React.useEffect(() => {
  //   console.log(provincias);
  // }, [])

  useEffect(() => {
    let cancel = false;
    apiQuery
      .get(`/api/product/${id}`)
      .then((respuesta) => {
        if (cancel) return;
        // console.log(respuesta);
        // Object.getOwnPropertyNames(respuesta).map((item)=>{console.log(item);})
        // console.log(JSON.stringify(respuesta, null, 4)[2]);
        // for (const key in respuesta) {
        //   if (Object.hasOwnProperty.call(respuesta, key)) {
        //     const element = respuesta[key];
        //     // console.log(`${element} - ${key}`);
        //     console.log(`${key}`);
        //   }
        // }
        setProducto(respuesta);
        apiQuery
          .get(`/api/categorias/${lista}/label`)
          .then((respuesta) => {
            console.log(respuesta);
            if (cancel) return;
            setNavList([...respuesta]);
          })
          .catch((error) => {
            error = new Error();
          });
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
        console.log(respuesta);
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
      name: `${data.get("firstName")} ${data.get("lastName")}`,
      password: data.get("password"),
      email: data.get("email"),
      address: `${data.get("calle")} ${data.get("altura")}`,
      provincia: data.get("provincia"),
      localidad: data.get("localidad"),
      phone: data.get("telefono"),
      cuit: data.get("cuit"),
      ferreteria: data.get("ferreteria"),
    };
    // set configurations
    const configuration = {
      method: "post",
      // url: `${config.SERVER}/register`,
      url: `${config.SERVER}/register`,
      data: registro,
    };

    // make the API call
    axios(configuration)
      .then((result) => {
        navigate(`/`, { replace: true });
      })
      .catch((error) => {
        error = new Error();
      });
  };

  function handleFirstName(e) {
    let firstName = e.target.value;
    if (isBetween(firstName.length, 3, 15)) {
      setNombre(firstName);
    } else {
      setNombre("");
    }
  }

  function handleLastName(e) {
    let lastName = e.target.value;
    if (isBetween(lastName.length, 3, 15)) {
      setApellido(lastName);
    } else {
      setApellido("");
    }
  }

  function handleEmail(e) {
    let email = e.target.value;
    if (isEmailValid(email)) {
      setCorreo(email);
    } else {
      setCorreo("");
    }
  }

  function handlePassword(e) {
    let password = e.target.value;
    if (isPasswordSecure(password)) {
      setPassword(password);
    } else {
      setPassword("");
    }
  }

  function handleRepeatPassword(e) {
    let password = e.target.value;
    setRepeatPassword(password);
  }

  const handleProvincia = (event) => {
    setProvincia(event.target.value);
  };

  const handleLocalidad = (event) => {
    setLocalidad(event.target.value);
  };

  const handlePhone = (e) => {
    let telefono = e.target.value;
    if (isNumber(telefono, 10)) {
      setTelefono(telefono);
    } else {
      setTelefono("");
    }
  };

  const handleCuit = (event) => {
    let cuit = event.target.value;
    if (isNumber(cuit, 11)) {
      setCuit(cuit);
    } else {
      setCuit("");
    }
  };

  const handleFerreteria = (event) => {
    let ferreteria = event.target.value;
    if (isBetween(ferreteria.length, 3, 30)) {
      setFerreteria(ferreteria);
    } else {
      setFerreteria("");
    }
  };

  const handleCalle = (event) => {
    let calle = event.target.value;
    if (isBetween(calle.length, 3, 30)) {
      setCalle(calle);
    } else {
      setCalle("");
    }
  };

  const handleAltura = (event) => {
    let altura = event.target.value;
    if (isBetween(altura.length, 1, 30)) {
      setAltura(altura);
    } else {
      setAltura("");
    }
  };

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
          Producto
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl variant="outlined" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Lista
                </InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={lista}
                  onChange={handleLista}
                  label="Lista"
                  name="Lista"
                  sx={{ width: "100%" }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {brand
                    .sort(function (a, b) {
                      if (a.iso_nombre > b.iso_nombre) {
                        return 1;
                      }
                      if (a.iso_nombre < b.iso_nombre) {
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
                    columnas.push(
                      <Grid
                        key={key}
                        item
                        md={key == "name" || key == "code" ? 12 : 6}
                        xs={12}
                      >
                        <TextField
                          // required
                          fullWidth
                          // disabled={key=="_id"}
                          name={key}
                          label={traductor(key)}
                          // type="password"
                          id={key}
                          // autoComplete="new-password"
                          // onChange={handlePassword}
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
                            Categoria
                          </InputLabel>
                          <Select
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
                                if (a.iso_nombre > b.iso_nombre) {
                                  return 1;
                                }
                                if (a.iso_nombre < b.iso_nombre) {
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
            disabled={botonSubmit}
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
