import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

function ChipCell(props) {
  const { hasFocus, value, trending } = props;
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

  switch(trending) {
    case 'sube':
      return (
        <>
      <Chip icon={<TrendingUpIcon />} label={value} color={Number(value) <= 50 ? "error" : "primary" } size="small"/>
        </>
      );
      case 'baja':
        return (
          <>
        <Chip icon={<TrendingDownIcon />} label={value} color={Number(value) <= 50 ? "error" : "primary" } size="small"/>
          </>
        );
    default:
      return (
        <>
      <Chip icon={<TrendingFlatIcon />} label={value} color={Number(value) <= 50 ? "error" : "primary" } size="small"/>
        </>
      );
  }
}

export default ChipCell