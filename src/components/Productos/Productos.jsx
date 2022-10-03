import React, {useContext, useState, useEffect} from 'react'
import { AppBar, Box, Toolbar, Badge, useMediaQuery, IconButton, Avatar, Button,CssBaseline,  TextField,FormControlLabel, Checkbox, Grid, Typography, Container, Select, MenuItem, InputLabel, FormControl} from '@mui/material'
import { ShoppingCart, LockOutlined } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import {provincias} from "../utils/provincias"
import {localidades} from "../utils/localidades"
import {config} from "../../config/config"
import axios from "axios";
import ApiQuery from "../utils/apiQuery/apiQuery"
let apiQuery = new ApiQuery();

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Desarrollado por '}
      <Link to={`/home`} color="inherit">
        //SITECNIA
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


function capitalizeFirstLetter(string) {
  let cadena = string.toLowerCase()
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

export default function SignUp() {
  
  let navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false)
  const [provincia, setProvincia] = React.useState('');
  const [localidadArray, setLocalidadArray] = React.useState([]);
  const [localidad, setLocalidad] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [apellido, setApellido] = React.useState('');
  const [correo, setCorreo] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [calle, setCalle] = React.useState('');
  const [altura, setAltura] = React.useState('');
  const [cuit, setCuit] = React.useState('');
  const [ferreteria, setFerreteria] = React.useState('');
  const [telefono, setTelefono] = React.useState('');
  const [botonSubmit, setBotonSubmit] = React.useState(true);
  const [passwordError, setPasswordError] = React.useState(false);
  const [producto, setProducto] = useState({})

// React.useEffect(() => {
//   console.log(provincias);
// }, [])

useEffect(() => {
  apiQuery.get(`/api/product/62fe8cdb80972ad19001c927`)
  .then((respuesta)=>{
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
    setProducto(respuesta)
  })
}, [])

React.useEffect(() => {
  let array = localidades.filter((item)=> item.provincia.nombre.match(new RegExp(`${provincia}`,'gi')))
  let uniq = [...new Set(array)];
  setLocalidadArray(uniq)
  // console.log(localidades.filter((item)=> item.provincia.nombre.match(new RegExp(`${provincia}`,'gi'))));
}, [provincia])

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log([...data.entries()]
    //   // email: data.get('email'),
    //   // password: data.get('password'),
    // );
    let registro={
      name: `${data.get('firstName')} ${data.get('lastName')}`,
      password: data.get('password'),
      email: data.get('email'),
      address: `${data.get('calle')} ${data.get('altura')}`,
      provincia: data.get('provincia'),
      localidad: data.get('localidad'),
      phone: data.get('telefono'),
      cuit: data.get('cuit'),
      ferreteria: data.get('ferreteria'),
    }
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
    let firstName= e.target.value
    if (isBetween(firstName.length, 3, 15)) {
      setNombre(firstName)
    } else {
    setNombre('')
    }
  }

  function handleLastName(e) {
    let lastName= e.target.value
    if (isBetween(lastName.length, 3, 15)) {
      setApellido(lastName)
    } else {
    setApellido('')
    }
  }

  function handleEmail(e) {
    let email= e.target.value
    if (isEmailValid(email)) {
      setCorreo(email)
    } else {
    setCorreo('')
    }
  }

  function handlePassword(e) {
    let password= e.target.value
    if (isPasswordSecure(password)) {
      setPassword(password)
    } else {
    setPassword('')
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

  const handlePhone = (e) => {
    let telefono= e.target.value
    if (isNumber(telefono,10)) {
      setTelefono(telefono)
    } else {
    setTelefono('')
    }
  };

  const handleCuit = (event) => {
    let cuit= event.target.value
    if (isNumber(cuit,11)) {
      setCuit(cuit)
    } else {
    setCuit('')
    }
  };

  const handleFerreteria = (event) => {
    let ferreteria= event.target.value
    if (isBetween(ferreteria.length, 3, 30)) {
      setFerreteria(ferreteria)
    } else {
    setFerreteria('')
    }

  };

  const handleCalle = (event) => {
    let calle= event.target.value
    if (isBetween(calle.length, 3, 30)) {
      setCalle(calle)
    } else {
    setCalle('')
    }
  };

  const handleAltura = (event) => {
    let altura= event.target.value
    if (isBetween(altura.length, 1, 30)) {
      setAltura(altura)
    } else {
    setAltura('')
    }
  };

  React.useEffect(() => {
    if (nombre && apellido && correo && password && repeatPassword && calle && altura && cuit && ferreteria && telefono && provincia && localidad) {
      setBotonSubmit(false)
    } else {
      setBotonSubmit(true)
    }
    
  }, [nombre, apellido, correo, password, repeatPassword, calle, altura, cuit, ferreteria, telefono, provincia, localidad])
  
  React.useEffect(() => {
    if (repeatPassword && (password!=repeatPassword)) {
      setPasswordError(true)
    } else {
      setPasswordError(false)
    }
  }, [password, repeatPassword])
  
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

const traductor = (palabra) => {
  const Diccionario ={
    id: "ID",
    _id: "ID",
    name: "Nombre",
    code: "Codigo",
    codigobarra: "Codigo de Barra",
    linea: "Linea",
    contenido: "Contenido",
    presentacion: "Pesentacion",
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
    uuid: "uuid"
  }
  return Diccionario[palabra]
}

  return (
    // <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Producto 
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
             

              {
              (() => {
                let columnas = []
                                  for (const key in producto) {
                                    if (Object.hasOwnProperty.call(producto, key)) {
                                      const element = producto[key];
                                      // console.log(`${element} - ${key}`);   
                                      columnas.push(
                                      <Grid key={key} item md={key=="name" || key=="_id" ? 12 : 6} xs={12}>
                                      <TextField
                                        required
                                        fullWidth
                                        disabled={key=="_id"}
                                        name={key}
                                        label={traductor(key)}
                                        // type="password"
                                        id={key}
                                        autoComplete="new-password"
                                        onChange={handlePassword}
                                        value={element}
                                      />
                                    </Grid>
                                      )
                                    }
                                  }
                            return <>{columnas}</>
              })()

              }

           

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={botonSubmit}
            >
              Aplicar
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