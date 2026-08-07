# Documentación de Implementación Admin: Configuración de Precios Públicos

Este documento detalla los cambios realizados en el panel administrador (`admin-react`).

---

## Cambios Aplicados en `admin-react`
- **Rama**: `feature/catalogo-publico-precios`
- **Componente de Configuración**:
  - `src/components/Configuracion/Configuracion.jsx`: Interfaz para alternar la visibilidad pública de los precios mediante un Switch de MUI y realizar la petición `POST /api/config/public-prices`.
- **Integración con Menú Lateral**:
  - `src/components/Drawer/Drawer.jsx`: Agregada la opción "Configuración" con el ícono `SettingsIcon` y registrada la ruta `/configuracion`.
