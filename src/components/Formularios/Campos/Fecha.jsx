import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/es';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Handyman } from '@mui/icons-material';
import { TextField} from '@mui/material/';

export default function ResponsivePickers({campo, traductor, handleKey, camposObject}) {
	const [key, setKey] = React.useState('');
	React.useEffect(() => {
	  setKey(campo) 
	}, [campo])
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es" >
          <DatePicker 
	  	required
	  	name={key}
		value={camposObject[key] || null}
		// onChange={handleKey}
		onChange={(date) => handleKey({ target: { name: key, value: date } })}
          	// renderInput={(params) => <TextField required {...params} />}
		// referenceDate={dayjs('2022-04-17')}
		label={traductor(key)} 
		defaultValue={dayjs()}
		slotProps={{
			textField: {
			  required: true,
			},
		}}
		sx={{width:"100%"}}
	/>
    </LocalizationProvider>
  );
}