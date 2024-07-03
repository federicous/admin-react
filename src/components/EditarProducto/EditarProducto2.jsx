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
import FileInput from "../FileInput/FileInput";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import AlertUpdateModal from "../Alert/AlertUpdateModal"
// import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

let apiQuery = new ApiQuery();

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} {...props} />;
});

// Agregar campos SIN EL LABEL
let tekbondCampos = [
  "lista",
  "code",
  "linea",
  "contenido",
  "presentacion",
  "color",
  "unidades",
  "usd",
  "pvpusd",
  "iva",
  "oferta",
  "precioOferta",
  "novedades",
];
let bremenCampos = [
  "lista",
  "code",
  "name",
  "price",
  "iva",
  "origin",
  "description",
  "oferta",
  "precioOferta",
  "novedades",
];
let kantonCampos = [
  "lista",
  "code",
  "name",
  "price",
  "iva",
  "pricepack",
  "description",
  "oferta",
  "precioOferta",
  "novedades",
];
let buloneriaBremenCampos = [
  "lista",
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
  "novedades",
  // "terminacion",
];
let sinparCampos = [
  "name",
  "lista",
  "code",
  "price",
  "iva",
  "ofertaUno",
  "ofertaDos",
  "ventaMinima",
  "oferta",
  "precioOferta",
  "novedades",
];
let coltecCampos = [
  "name",
  "lista",
  "code",
  "price",
  "usd",
  "iva",
  "unidades",
  "presentacion",
  "oferta",
  "precioOferta",
  "novedades",
];
let brmElectroCampos = [
  "name",
  "lista",
  "code",
  "price",
  "iva",
  "linea",
  "codigobarra",
  "oferta",
  "precioOferta",
  "novedades",
];
let interquim = [
  "name",
  "lista",
  "code",
  "price",
  "iva",
  "oferta",
  "precioOferta",
  "novedades",
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
  } else if (lista == "coltec") {
    return coltecCampos;
  } else if (lista == "brm electro") {
    return brmElectroCampos;
  } else if (lista == "interquim") {
    return interquim;
  }
};

function capitalizeFirstLetter(string) {
  let cadena = string.toLowerCase();
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

export default function AddProduct() {
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [navList, setNavList] = React.useState([]);
  const [brand, setBrand] = React.useState([]);
  const [categoria, setCategoria] = useState("");
  const [lista, setLista] = useState("");
  const [iva, setIva] = useState("");
  const [oferta, setOferta] = useState("");
  const [novedades, setNovedades] = useState("");
  const [producto, setProducto] = useState({});
  const [camposObject, setCamposObject] = useState({});
  const [resultUpdate, setResultUpdate] = useState({});
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

  useEffect(() => {
    let cancel = false;
    apiQuery
      .get(`/api/product/${id}`)
      .then((respuesta) => {
        if (cancel) return;
        // respuesta["iva"]=Number(respuesta["iva"].replace(/%/g,""))
        setProducto(respuesta);
        setCamposObject(respuesta);
        console.log(respuesta);
        setLista(respuesta.lista);
        apiQuery
          .get(`/api/categorias/${respuesta.lista}/label`)
          .then((respuesta) => {
            console.log(respuesta);
            if (cancel) return;
            setNavList([...respuesta].filter(Boolean));
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
  }, []);

  const handleCategoria = (event) => {
    setCategoria(event.target.value);
  };

  const handleIva = (event) => {
    setIva(event.target.value);
  };

  const handleOferta = (event) => {
    setOferta(event.target.value);
  };

  const handleNovedades = (event) => {
    setNovedades(event.target.value);
  };

  const handleLista = (event) => {
    setLista(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    apiQuery
      .putFormData(`/api/products/`, data)
      .then((respuesta) => {
        // console.log(respuesta);
        setResultUpdate(respuesta);
        if (respuesta.result == "ok") {
          setOpen(true);
        }
      })
      .catch((error) => {
        error = new Error();
      });
  };

  const handleKey = (event) => {
    // console.log(event.target.value);
    // console.log(event.target.name);
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
      code: "Codigo",
      codigobarra: "Codigo de Barra",
      linea: "Linea",
      contenido: "Contenido",
      presentacion: "Presentacion",
      color: "Color",
      unidades: "Unidades x caja",
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
      rosca: "Rosca",
      cabeza: "Cabeza",
      punta: "Punta",
      terminacion: "Terminación",
      oferta: "Oferta",
      novedades: "Novedades",
      precioOferta: "Precio Oferta",
      ofertaUno: "Oferta I",
      ofertaDos: "Oferta II",
      ventaMinima: "Venta minima",
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
            Elemento actualizado!
          </Alert>
        </Snackbar>

        <Typography component="h1" variant="h5">
          Editar producto
        </Typography>
        <Box
          component="form"
          // noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
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
                              // value={iva ? iva : producto.iva}
                              value={
                                camposObject[key]
                                // ? camposObject[key]
                                // : producto[key]
                              }
                              // value={"3"}
                              // onChange={handleIva}
                              onChange={handleKey}
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
                    } else if (key == "novedades") {
                      columnas.push(
                        <Grid
                          key={key}
                          item
                          md={key == "name" || key == "code" ? 12 : 12}
                          xs={12}
                        >
                          <FormControl
                            variant="outlined"
                            sx={{ width: "100%" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              Novedades
                            </InputLabel>
                            <Select
                              required
                              fullWidth
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              // value={iva ? iva : producto.iva}
                              value={
                                camposObject[key]
                                ? camposObject[key]
                                : "no"
                              }
                              // value={"3"}
                              // onChange={handleOferta}
                              onChange={handleKey}
                              label="novedades"
                              name="novedades"
                              sx={{ width: "100%" }}
                            >
                              <MenuItem value="si">si</MenuItem>
                              <MenuItem value="no">no</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      );
                      continue;
                    } else if (key == "oferta") {
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
                              Oferta
                            </InputLabel>
                            <Select
                              required
                              fullWidth
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              // value={iva ? iva : producto.iva}
                              value={
                                camposObject[key]
                                ? camposObject[key]
                                : "no"
                              }
                              // value={"3"}
                              // onChange={handleOferta}
                              onChange={handleKey}
                              label="oferta"
                              name="oferta"
                              sx={{ width: "100%" }}
                            >
                              <MenuItem value="si">si</MenuItem>
                              <MenuItem value="no">no</MenuItem>
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
                        md={["name"].includes(key) ? 12 : 6}
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
                          //   disabled={["code"].includes(key) ? true : false}
                          InputProps={{
                            readOnly: ["code", "lista"].includes(key)
                              ? true
                              : false,
                          }}
                          name={key}
                          label={traductor(key)}
                          type={
                            [
                              // "code",
                              "price",
                              "usd",
                              "pvpusd",
                              "unidades",
                              "pricepack",
                              "precioOferta",
                            ].includes(key)
                              ? "number"
                              : "text"
                          }
                          id={key}
                          variant={
                            ["code", "lista"].includes(key)
                              ? "filled"
                              : "outlined"
                          }
                          // autoComplete="new-password"
                          onChange={handleKey}
                          value={
                            camposObject[key]
                            // ? camposObject[key]
                            // : producto[key]
                          }
                          // placeholder={`${element}`}
                        />
                      </Grid>
                    );
                  }
                  return (
                    <>
                      {columnas}
                      <Grid item xs={12}>
                      <FormControl
                            variant="outlined"
                            sx={{ width: "100%" }}
                          >
                            <TextField
                              fullWidth
                              type="number"
                              labelId="demo-simple-select-outlined-label"
                              id="demo-simple-select-outlined"
                              // value={iva ? iva : producto.iva}
                              value={
                                camposObject["multiplo"]
                                // ? camposObject[key]
                                // : producto[key]
                              }
                              // value={"3"}
                              // onChange={handleIva}
                              onChange={handleKey}
                              label="Multiplo"
                              name="multiplo"
                              sx={{ width: "100%" }}
                            />
                          </FormControl>
                      </Grid>
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
                            value={categoria ? categoria : producto.label}
                            onChange={handleCategoria}
                            label="Categoría"
                            name="label"
                            sx={{ width: "100%" }}
                          >
                            {/* <MenuItem value="">
                                <em>None</em>
                              </MenuItem> */}
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
                        <FileInput img={producto.image} />
                      </Grid>
                    </>
                  );
                })()}
              </>
            )}
          </Grid>
          <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 2 }}>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              type="button"
              fullWidth
              variant="contained"
              onClick={handleDelete}
              // disabled={botonSubmit}
            >
              Eliminar
            </Button>
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
