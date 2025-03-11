import * as React from 'react';
import { Stack, Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import { DataGrid } from '@mui/x-data-grid';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

function ChipCell(props) {
  const [rbl, setRbl] = React.useState("")

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
    setRbl(value)
    // console.log(value);
  }, [value]) 

  return (
    <>
      <Stack>
        {rbl?.split(' ').map((item) => (
          <Box key={item} component="div" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: "nowrap", maxWidth:130 }}>{item}</Box>
        ))}
      </Stack>
    </>
  );
}

export default ChipCell