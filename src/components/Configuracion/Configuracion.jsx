import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import Cookies from "universal-cookie";
import { config } from "../../config/config";

const cookies = new Cookies();

export default function Configuracion() {
  const [mostrarPreciosPublicos, setMostrarPreciosPublicos] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  const token = cookies.get("token");

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.SERVER}/api/config/public-prices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.data && typeof res.data.mostrarPreciosPublicos === "boolean") {
        setMostrarPreciosPublicos(res.data.mostrarPreciosPublicos);
      }
    } catch (error) {
      console.error("Error al obtener la configuración:", error);
      setAlertInfo({ type: "error", message: "Error al cargar la configuración de precios públicos." });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublicPrices = async (event) => {
    const newValue = event.target.checked;
    setMostrarPreciosPublicos(newValue);
    setSaving(true);
    setAlertInfo(null);

    try {
      const res = await axios.post(
        `${config.SERVER}/api/config/public-prices`,
        { mostrarPreciosPublicos: newValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setMostrarPreciosPublicos(Boolean(res.data.mostrarPreciosPublicos));
      setAlertInfo({
        type: "success",
        message: newValue
          ? "Precios públicos HABILITADOS. Los visitantes sin iniciar sesión podrán ver los precios."
          : "Precios públicos DESHABILITADOS. Los visitantes verán 'Inicie sesión para ver precio'.",
      });
    } catch (error) {
      console.error("Error al guardar la configuración:", error);
      setMostrarPreciosPublicos(!newValue); // Revert switch on error
      setAlertInfo({ type: "error", message: "Error al guardar los cambios en el servidor." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <SettingsIcon sx={{ fontSize: 32, mr: 1, color: "primary.main" }} />
          <Typography variant="h5" component="h1">
            Configuración General de la Tienda
          </Typography>
        </Box>

        {alertInfo && (
          <Alert severity={alertInfo.type} sx={{ mb: 3 }} onClose={() => setAlertInfo(null)}>
            {alertInfo.message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Visibilidad de Precios en Catálogo Público
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Permite decidir si las personas que no han iniciado sesión en la tienda web pueden ver los precios de los productos. Por defecto, los precios permanecen ocultos.
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={mostrarPreciosPublicos}
                    onChange={handleTogglePublicPrices}
                    disabled={saving}
                    color="primary"
                  />
                }
                label={
                  mostrarPreciosPublicos
                    ? "Precios visibles públicamente (Sin Login)"
                    : "Precios ocultos públicamente (Por defecto)"
                }
              />
              {saving && <CircularProgress size={20} sx={{ ml: 2, display: "inline-block" }} />}
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
}
