import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function BasicTextFields({campo, required, readOnly, traductor, handleKey, camposObject, type, variant, multiline}) {
	const [key, setKey] = React.useState('');
	React.useEffect(() => {
	  setKey(campo) 
	}, [campo])
  return (
    <>
      <TextField
                  required={required}
                  fullWidth
                  InputProps={{
                    readOnly: readOnly,
                  }}
                  name={key}
                  label={traductor(key)}
                  type={type}
                  id={key}
                  variant={variant}
                  // autoComplete="new-password"
                  onChange={handleKey}
                  value={
                    camposObject[key] || ""
                  }
                  multiline={multiline || false}
                  maxRows={4}
                  // placeholder={`${element}`}
                />
    </>
  );
}