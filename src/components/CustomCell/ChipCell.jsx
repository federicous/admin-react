import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

function ChipCell(props) {
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
      <Chip icon={<WarningAmberIcon />} label={value} color={"error" } variant="outlined"/>
        </>
      );
  }

}

export default ChipCell