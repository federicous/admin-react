import * as React from 'react';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

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


  React.useEffect(() => {
    console.log(params.row.ip);
  }, []);

  return (
    <>
	<Chip icon={<ReportProblemIcon />} label={params.row.reputation} color={Number(params.row.senderscore) <= 50 ? "error" : "primary" }/>
    </>
  );
}

export default ChipCell