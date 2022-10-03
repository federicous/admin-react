// import React from 'react'

// const Productos = () => {
//   return (
//     <div>Productos</div>
//   )
// }

// export default Productos


import * as React from 'react';
// import { createTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import { AppBar, Box, Toolbar, Badge, useMediaQuery, IconButton, Avatar, Button,CssBaseline,  TextField,FormControlLabel, Checkbox, Grid, Typography, Container, Select, MenuItem, InputLabel, FormControl} from '@mui/material'
import { ShoppingCart, LockOutlined } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import {provincias} from "../utils/provincias"
import {localidades} from "../utils/localidades"
import {config} from "../../config/config"
import axios from "axios";

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

// React.useEffect(() => {
//   console.log(provincias);
// }, [])

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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registro 
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Nombre"
                  autoFocus
                  onChange={handleFirstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Apellido"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleLastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo"
                  name="email"
                  autoComplete="email"
                  type="email"
                  onChange={handleEmail}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  helperText={!password ? "Letra mayúscula, letra minúscula, número, +8 caracteres " : ""}
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handlePassword}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  error={passwordError}
                  helperText={passwordError ? "No coinciden" : ""}
                  disabled={!password}
                  fullWidth
                  name="repeatPassword"
                  label="Repetir Contraseña"
                  type="password"
                  id="repeatPassword"
                  autoComplete="new-password"
                  onChange={handleRepeatPassword}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" sx={{width:"100%"}} >
                <InputLabel id="demo-simple-select-outlined-label">Provincia</InputLabel>
                <Select
                fullWidth
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={provincia}
                  onChange={handleProvincia}
                  label="Provincia"
                  name="provincia"
                  sx={{width:"100%"}}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {provincias.sort(function (a, b) {
                    if (a.iso_nombre > b.iso_nombre) {
                      return 1;
                    }
                    if (a.iso_nombre < b.iso_nombre) {
                      return -1;
                    }
                    // a must be equal to b
                    return 0;
                  }).map((item) => (
                    <MenuItem key={item.id} value={item.iso_nombre}>{item.iso_nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" sx={{width:"100%"}} disabled={!provincia} >
                <InputLabel id="demo-simple-select-outlined-label">Localidad</InputLabel>
                <Select
                fullWidth
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={localidad}
                  onChange={handleLocalidad}
                  label="Localidad"
                  sx={{width:"100%"}}
                  name="localidad"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {localidadArray.sort(function (a, b) {
                    if (a.nombre > b.nombre) {
                      return 1;
                    }
                    if (a.nombre < b.nombre) {
                      return -1;
                    }
                    // a must be equal to b
                    return 0;
                  }).map((item) => (
                    <MenuItem key={item.id} value={capitalizeFirstLetter(item.nombre)}>{capitalizeFirstLetter(item.nombre)}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="ferreteria"
                  label="Ferretería"
                  name="ferreteria"
                  autoComplete="ferreteria"
                  onChange={handleFerreteria}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="calle"
                  label="Calle"
                  name="calle"
                  autoComplete="calle"
                  onChange={handleCalle}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="altura"
                  name="altura"
                  required
                  fullWidth
                  id="altura"
                  label="Altura"
                  onChange={handleAltura}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="cuit"
                  name="cuit"
                  required
                  fullWidth
                  id="cuit"
                  label="CUIT"
                  type="number"
                  onChange={handleCuit}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="telefono"
                  label="Teléfono"
                  name="telefono"
                  autoComplete="telefono"
                  type="number"
                  onChange={handlePhone}
                />
              </Grid>

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={botonSubmit}
            >
              Registrar
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link style={{ color: "inherit", display: "flex", flexDirection: "row", alignItems: "center",}}
                 to={`/home`} >
                  Ya tiene una cuenta? Iniciar sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ my: 4 }} />
      </Container>
    // </ThemeProvider>
  );
}