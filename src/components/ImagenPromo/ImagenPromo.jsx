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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Link } from "react-router-dom";
import ApiQuery from "../utils/apiQuery/apiQuery";
import FileInput from "../FileInput/FileInput";

let apiQuery = new ApiQuery();

function capitalizeFirstLetter(string) {
  let cadena = string.toLowerCase();
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

export default function AddProduct() {
  const [imagen, setImagen] = React.useState("");

  useEffect(() => {
    let cancel = false;
    apiQuery
      .get(`/api/categorias/`)
      .then((respuesta) => {
        if (cancel) return;
        // setNavList([...respuesta].filter(Boolean));
      })
      .catch((error) => {
        error = new Error();
      });
    return () => {
      cancel = true;
    };
  }, []);


   const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(event.currentTarget);
    console.log(data);
    apiQuery
      .postFormData(`/api/promo/`, data)
      .then((respuesta) => {
        console.log(respuesta);
      })
      .catch((error) => {
        error = new Error();
      });
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
          Imagen Promocional
        </Typography>
        <Box
          component="form"
          // noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <Grid container spacing={2}>
              {<>
                <Grid item xs={12}>
                  <FileInput img={imagen}/>
                </Grid>
              </>}
          </Grid>
          <Box
            sx={{
              marginTop: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <FormControlLabel control={<Checkbox defaultChecked />} label="Habilitar" name="habilitar"/>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            // disabled={botonSubmit}
          >
            Aplicar
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    // </ThemeProvider>
  );
}
