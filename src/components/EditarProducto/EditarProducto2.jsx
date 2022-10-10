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
import EditIcon from '@mui/icons-material/Edit';

let apiQuery = new ApiQuery();

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
let bremenCampos = ["code", "name", "price", "iva", "origin", "description"];
let kantonCampos = ["code", "name", "price", "iva", "pricepack", "description"];

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

export default function AddProduct() {
  const { id } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [navList, setNavList] = React.useState([]);
  const [brand, setBrand] = React.useState([]);
  const [categoria, setCategoria] = useState("");
  const [lista, setLista] = useState("");
  const [iva, setIva] = useState("");
  const [producto, setProducto] = useState({});
  const [camposObject, setCamposObject] = useState({})

  useEffect(() => {
    let cancel = false;
    apiQuery
      .get(`/api/categorias/${lista}/label`)
      .then((respuesta) => {
        if (cancel) return;
        setNavList([...respuesta]);
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

  useEffect(() => {
    let cancel = false;
    apiQuery
      .get(`/api/product/${id}`)
      .then((respuesta) => {
        if (cancel) return;
        setProducto(respuesta);
        setLista(respuesta.lista);
        apiQuery
          .get(`/api/categorias/${respuesta.lista}/label`)
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
      .putFormData(`/api/products/`, data)
      .then((respuesta) => {
        console.log(respuesta);
        console.log(`apiquery22`);
      })
      .catch((error) => {
        error = new Error();
      });
  };

  const handleKey = (event) => {
    console.log(event.target.value);
    console.log(event.target.name);
	let valorCampo = event.target.value;
	let nombreCampo = event.target.name
	let nuevoCampoObject = {...camposObject}
	nuevoCampoObject[nombreCampo]=valorCampo;
    setCamposObject({...nuevoCampoObject})
    console.log(nuevoCampoObject);
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
          Editar producto
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
                  Lista
                </InputLabel>
                <Select
                //   required
                  fullWidth
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={lista}
                  onChange={handleLista}
                  label={traductor("lista")}
                  name="lista"
                  sx={{ width: "100%" }}
		  InputProps={{
		    readOnly: true,
		  }}
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
                              value={iva ? iva : producto.iva}
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
                            ["code","description", "unidades", "contenido"].includes(
                              key
                            )
                              ? false
                              : true
                          }
                          fullWidth
                        //   disabled={["code"].includes(key) ? true : false}
			  InputProps={{readOnly: ["code"].includes(key) ? true : false,}}
                          name={key}
                          label={traductor(key)}
                          type={
                            [
                              "code",
                              "price",
                              "usd",
                              "pvpusd",
                              "unidades",
                              "pricepack",
                            ].includes(key)
                              ? "number"
                              : "text"
                          }
                          id={key}
                          // autoComplete="new-password"
                          onChange={handleKey}
                          value={camposObject[key] ? camposObject[key] : producto[key]}
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
                            value={categoria ? categoria : producto.label}
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
          <Stack direction="row" spacing={2} sx={{ mt: 3, mb: 2 }}>
            <Button
              startIcon={<DeleteIcon />}
              color="error"
              type="submit"
              fullWidth
              variant="contained"
              // disabled={botonSubmit}
            >
              Eliminar
            </Button>
            <Button
              startIcon={<EditIcon />}
              type="submit"
              fullWidth
              variant="contained"
              // disabled={botonSubmit}
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
