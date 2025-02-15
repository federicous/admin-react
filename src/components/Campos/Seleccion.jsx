import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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
                {item}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
}
