
import React, { useState, useEffect } from 'react'
import { Typography, Box, CircularProgress, Tabs, Tab } from '@mui/material'
import Clientes from "../Formularios/ClientesEdit";
// import ClientesDataGrid from "../DataGrid/ClientesDataGrid";
import PropTypes from 'prop-types';

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography component={"span"}>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
      };

const ItemListContainer = () => {
	// Backdrop or Loading spinner 
	const [open, setOpen] = useState(false);
	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<>
			{open ? (
				<>
					<Box sx={{ display: 'flex', mt: "30vh", height: "100%" }}>
						<CircularProgress />
					</Box>
				</>) : (<>
					<Box sx={{ width: '100%' }}>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
								<Tab label="Agregar" />
								<Tab label="Lista" />
								{/* <Tab label="Lista" /> */}
							</Tabs>
						</Box>
						<CustomTabPanel value={value} index={0}>
							<Clientes/>
						</CustomTabPanel>
						<CustomTabPanel value={value} index={1}>
							{/* <ClientesDataGrid/> */}
						</CustomTabPanel>
						{/* <CustomTabPanel value={value} index={2}>
							Item Three
						</CustomTabPanel> */}
					</Box>

				</>
			)
			}
		</>
	)
}

export default ItemListContainer
