import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

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

  switch(params.row.estadora) {
    case 'arrowup.jpeg':
      return (
        <>
      <Chip icon={<TrendingUpIcon />} label={params.row.reputationauthority} color={Number(params.row.senderscore) <= 50 ? "error" : "primary" }/>
        </>
      );
      case 'arrowdown.jpeg':
        return (
          <>
        <Chip icon={<TrendingDownIcon />} label={params.row.reputationauthority} color={Number(params.row.senderscore) <= 50 ? "error" : "primary" }/>
          </>
        );
    default:
      return (
        <>
      <Chip icon={<TrendingFlatIcon />} label={params.row.reputationauthority} color={Number(params.row.senderscore) <= 50 ? "error" : "primary" }/>
        </>
      );
  }
}

export default ChipCell