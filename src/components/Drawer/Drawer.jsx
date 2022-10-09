// import * as React from 'react';
import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  BrowserRouter,
  Route,
  Routes,
  withRouter,
  Link,
} from "react-router-dom";

import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import HandymanIcon from '@mui/icons-material/Handyman';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import Productos from "../Productos/Productos";
import Ordenes from "../Ordenes/Ordenes";
import Listas from "../Listas/Listas";
import Usuarios from "../Usuarios/Usuarios";
import EditarProducto from "../EditarProducto/EditarProducto";
import AddProduct from "../AddProduct/AddProduct";
// import ApiQuery from "../utils/apiQuery/apiQuery"
// let apiQuery = new ApiQuery();

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = React.useState(false);
  const [openClientes, setOpenClientes] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickClientes = () => {
    setOpenClientes(!openClientes);
  };
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //   useEffect(() => {
  //   apiQuery.get(`/api/product/62fe8cdb80972ad19001c927`)
  //   .then((respuesta)=>{
  //     console.log(respuesta);
  //     setIsAdmin(respuesta)
  //   })
  // }, [])

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <HandymanIcon />
          </ListItemIcon>
          <ListItemText primary="Productos" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to="/productos/agregar" style={{ textDecoration: "none" }}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Agregar"
                  sx={{ color: "text.primary" }}
                />
              </ListItemButton>
            </Link>
            <Link to="/producto" style={{ textDecoration: "none" }}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Editar"
                  sx={{ color: "text.primary" }}
                />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
        <ListItemButton onClick={handleClickClientes}>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary="Clientes" />
          {openClientes ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openClientes} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link to="/productos/agregar" style={{ textDecoration: "none" }}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Agregar"
                  sx={{ color: "text.primary" }}
                />
              </ListItemButton>
            </Link>
            <Link to="/producto" style={{ textDecoration: "none" }}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Editar"
                  sx={{ color: "text.primary" }}
                />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
      </List>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <BrowserRouter>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Administrador
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Routes>
            <Route exact path="/productos/" element={<Productos />} />
            <Route exact path="/productos/agregar/" element={<AddProduct />} />
            <Route exact path="/producto/:id" element={<EditarProducto />} />
            <Route exact path="/ordenes" element={<Ordenes />} />
            <Route exact path="/listas" element={<Listas />} />
            <Route exact path="/usuarios" element={<Usuarios />} />

            {/* <Route exact path="/"  element={<Login />}/>
              <Route path="/" element={<ProtectedRoutes />}>
                <Route path="/home" element={<HomePage2 />} />
                <Route exact path="/category/:category" element={<ItemListContainer />} /> 
                <Route exact path="/admin" element={<Admin />} />     
                <Route exact path="/alert/:message" element={<AlertMessage />} />     
              </Route>
              <Route exact path="*" element={<Return />} />  */}
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default ResponsiveDrawer;
