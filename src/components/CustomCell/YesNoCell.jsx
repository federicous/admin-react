import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import RemoveIcon from '@mui/icons-material/Remove';

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
    case 'yes':
      return (
        <>
        <WarningAmberIcon color="error"/>
        </>
      );
      case 'no' :
        return (
          <>
        <RemoveIcon />
          </>
        );
    default:
      return (
        <>
      <Chip icon={<TrendingFlatIcon />} label={value} color={Number(value) <= 50 ? "error" : "primary" }/>
        </>
      );
  }
}

export default ChipCell