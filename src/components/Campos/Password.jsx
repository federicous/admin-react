import * as React from 'react';
import {InputLabel, FormControl, IconButton} from '@mui/material';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

export default function BasicTextFields({campo, required, readOnly, traductor, handleKey, camposObject, type, variant, multiline}) {
	const [key, setKey] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  function handlePassword(e) {
    let password= e.target.value
    if (isPasswordSecure(password)) {
      setPassword(password)
      setPasswordError(false)
    } else {
      setPassword('')
      setPasswordError(true)
    }
  }

  const isPasswordSecure = (password) => {
    // const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    return re.test(password);
  };

	React.useEffect(() => {
	  setKey(campo) 
	}, [campo])
  return (
    <>
      {/* <TextField
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
                /> */}
                      <FormControl variant="outlined" fullWidth required>
                      <InputLabel htmlFor="outlined-adornment-password" color={password ? "success" : "error"} error={passwordError}>Contraseña</InputLabel>
                            <OutlinedInput
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              color={password ? "success" : "error"}
                              error={passwordError}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                              // label="Password"
                              fullWidth
                              helperText={!password ? "Requiere: mayúscula, minúscula, número, +8 caracteres " : ""}
                              name="password"
                              label="Contraseña *"
                              // type="password"
                              // id="password"
                              autoComplete="new-password"
                              onChange={handlePassword}                    
                            />
                  <FormHelperText required id="standard-weight-helper-text">{!password ? "Requiere: mayúscula, minúscula, número, +8 caracteres " : ""}</FormHelperText>
                </FormControl>
    </>
  );
}