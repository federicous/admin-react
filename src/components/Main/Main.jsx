import React from 'react';
import { BrowserRouter, Route, Routes, withRouter } from "react-router-dom";
import ResponsiveDrawer from '../Drawer/Drawer';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


const Main = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ResponsiveDrawer/>
    </ThemeProvider>
  )
}

export default Main