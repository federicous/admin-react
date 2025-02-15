import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions }  from '@mui/material/Autocomplete';
import { Box } from '@mui/material/';

function capitalizeFirstLetter(string="") {
  let cadena = string.toLowerCase();
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

const filterOptions = createFilterOptions({
  stringify: (option) => [option.ferreteria , option.name, option.email].filter(Boolean).join(" - "),
});

export default function BasicSelect({campo, traductor, handleKey, camposObject, listaOpciones, required, readOnly}) {
  const [key, setKey] = React.useState('');
  const [listaClientes, setListaClientes] = React.useState([])
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    setKey(campo) 
    setListaClientes(listaOpciones)
  }, [campo, listaOpciones])

  return (
    <>
    <Autocomplete
      freeSolo
      name={key}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        // console.log(newValue);
      }}
      // inputValue={inputValue}
      // onInputChange={(event, newInputValue) => {
      //   setInputValue(newInputValue);
      // }}
      disablePortal
      id="combo-box-demo"
      getOptionLabel={(option) => option.email || ""}
      filterOptions={filterOptions}
      renderOption={(props, option) => (
        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
        {/* {[option.ferreteria , option.name, option.email, (option.localidad && option.provincia) ? `[${option.localidad}, ${option.provincia}]` : ""].filter(Boolean).join(" - ")} */}
        {[option.ferreteria , option.name, option.email].filter(Boolean).join(" - ") || ""}
        </Box>
      )}
      options={listaClientes
        .sort(function (a, b) {
          if (capitalizeFirstLetter(a.name) > capitalizeFirstLetter(b.name)) {
            return 1;
          }
          if (capitalizeFirstLetter(a.name) < capitalizeFirstLetter(b.name)) {
            return -1;
          }
          // a must be equal to b
          return 0;
        })}
      // sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={traductor(key)} name={key} />}
    />
          <TextField
                  sx={{display:"none"}}
                  fullWidth
                  name={"ferreteria"}
                  value={
                    value?.ferreteria || ""
                  }
                />
          <TextField
                  sx={{display:"none"}}
                  fullWidth
                  name={"name"}
                  value={
                    value?.name || ""
                  }
                />
    </>
  );
  
}
