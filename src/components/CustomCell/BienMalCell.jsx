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
import CloseIcon from '@mui/icons-material/Close';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

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

  switch(`${value}`.toLowerCase()) {
    case 'bien.png':
      return (
        <>
        <ThumbUpIcon color="success"/>
        </>
      );
      case 'mal.png' :
        return (
          <>
        <ThumbDownIcon color="error" />
          </>
        );
    default:
      return (
        <>
        <QuestionMarkIcon/>
        </>
      );
  }
}

export default ChipCell