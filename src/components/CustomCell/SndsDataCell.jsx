import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { Tooltip, IconButton } from '@mui/material/';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

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

  switch(value) {
    case 'green':
      return (
        <>
        <Tooltip title={`Spam < 10%`} arrow placement="right">
      <Chip icon={<ThumbUpOffAltIcon />} label={value} color={"success"} size="small"/>
      </Tooltip>
        </>
      );
      case 'yellow':
        return (
          <>
          <Tooltip title={`10% < spam < 90%`} arrow placement="right">
        <Chip icon={<ErrorOutlineIcon />} label={value} color={"warning"} size="small"/>
      </Tooltip>
          </>
        );
    default:
      return (
        <>
        <Tooltip title={`Spam > 90%`} arrow placement="right">
      <Chip icon={<WarningAmberIcon />} label={"red"} color={"error"} size="small"/>
      </Tooltip>
        </>
      );
  }
}

export default ChipCell