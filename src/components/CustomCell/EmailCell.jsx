import * as React from 'react';
import {Button, TextField} from '@mui/material';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

function CustomCell(props) {
  const { hasFocus, value, params } = props;
  const buttonElement = React.useRef(null);
  const rippleRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (hasFocus) {
      const input = buttonElement.current.querySelector('input');
      input?.focus();
    } else if (rippleRef.current) {
      // Only available in @mui/material v5.4.1 or later
      rippleRef.current.stop({});
    }
  }, [hasFocus]);

  switch(value) {
    case 'good':
      return (
        <>
      <Chip icon={<ThumbUpOffAltIcon fontSize='small'/>} label={value} color={"primary"} variant="outlined" size="small"/>
        </>
      );
      case 'poor':
        return (
          <>
        <Chip icon={<ErrorOutlineIcon fontSize='small' />} label={value} color={"warning"} variant="outlined" size="small"/>
          </>
        );
    default:
      return (
        <>
          <TextField
            required
            fullWidth
            id="email"
            label="Correo"
            name="email"
            autoComplete="email"
            type="email"
            value={value}
            // onChange={handleEmail}
            // color={correo ? "success" : "error"}
            // error={correoError}
          />
        </>
      );
  }

}

export default CustomCell