import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

function capitalizeFirstLetter(string="") {
  let cadena = string.toLowerCase();
  return cadena.charAt(0).toUpperCase() + cadena.slice(1);
}

export default function BasicSelect({campo, traductor, handleKey, camposObject, listaOpciones, required, readOnly}) {
  const [key, setKey] = React.useState('');
  React.useEffect(() => {
    setKey(campo) 
  }, [campo])
  
  return (
    <>
      <FormControl key={key} variant="outlined" sx={{ width: "100%" }}>
        <InputLabel id="demo-simple-select-outlined-label">
          {`${traductor(key)} *`}
        </InputLabel>
        <Select
          required={required}
          fullWidth
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={camposObject[key] || ""}
          onChange={handleKey}
          label={traductor(key)}
          name={key}
          sx={{ width: "100%" }}
        >
          {/* <MenuItem value="">
            <em>None</em>
          </MenuItem> */}
          {listaOpciones
            .sort(function (a, b) {
              if (capitalizeFirstLetter(a.name) > capitalizeFirstLetter(b.name)) {
                return 1;
              }
              if (capitalizeFirstLetter(a.name) < capitalizeFirstLetter(b.name)) {
                return -1;
              }
              // a must be equal to b
              return 0;
            })
            .map((item, index) => (
              <MenuItem key={index} value={item.email}>
                {[capitalizeFirstLetter(`${item.name}`) , capitalizeFirstLetter(item.ferreteria), `${item.email}`].filter(Boolean).join(" - ")}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
}
