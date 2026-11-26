import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { config } from '../../config/config';

const estado = {
  pending: 'Pendiente de envío',
  sending: 'Enviando',
  accepted: 'Aceptado por el proveedor (no confirma recepción)',
  review: 'Requiere revisión',
  unavailable: 'Sin información de correo',
};

const fecha = value => {
  const n = Number(value);
  const d = new Date(Number.isFinite(n) && value !== '' ? n : value);
  return Number.isNaN(d.getTime())
    ? 'Fecha no disponible'
    : d.toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
};

const PAGE_SIZE = 50;
const FIXED_PAGINATION_MODEL = { page: 0, pageSize: PAGE_SIZE };
const PAGE_SIZE_OPTIONS = [PAGE_SIZE];
const EXPORTABLE_FIELDS = new Set(['timestamp', 'id', 'email', 'presupuesto', 'notificationStatus']);
const INITIAL_FILTERS = {
  id: '',
  email: '',
  from: '',
  to: '',
  type: '',
  notificationStatus: '',
};

const LOCALE_TEXT = {
  ...esES.components.MuiDataGrid.defaultProps.localeText,
  noRowsLabel: 'No se encontraron pedidos.',
};

export function sanitizeCsvCell(value) {
  const raw = value == null ? '' : String(value);
  const needsFormulaGuard = /^[\t\r ]*[=+\-@]/.test(raw) || /^[\t\r]/.test(raw);
  const guarded = needsFormulaGuard ? `'${raw}` : raw;
  if (/[",\n\r]/.test(guarded) || needsFormulaGuard) {
    return `"${guarded.replace(/"/g, '""')}"`;
  }
  return guarded;
}

export function buildOrdersCsv({ rows, columns, columnVisibilityModel = {} }) {
  const visibleCols = columns.filter(
    col => EXPORTABLE_FIELDS.has(col.field) && columnVisibilityModel[col.field] !== false
  );
  if (!visibleCols.length) return '';

  const valueFor = (row, field) => {
    if (field === 'timestamp') return fecha(row.timestamp);
    if (field === 'presupuesto') return row.presupuesto ? 'Presupuesto' : 'Pedido';
    if (field === 'notificationStatus') return estado[row.notificationStatus] || estado.unavailable;
    return row[field] ?? '';
  };

  const lines = [
    visibleCols.map(col => sanitizeCsvCell(col.headerName)).join(','),
    ...rows.map(row => visibleCols.map(col => sanitizeCsvCell(valueFor(row, col.field))).join(',')),
  ];
  return `\uFEFF${lines.join('\r\n')}`;
}

function formatArs(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return 'No disponible';
  return n.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatIva(rawIva) {
  if (rawIva == null || rawIva === '') return 'No disponible';
  const normalized = String(rawIva).replace(/,/g, '.').replace(/%/g, '').trim();
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? `${parsed}%` : String(rawIva);
}

function formatCatalogReference(product) {
  if (!product || typeof product !== 'object') return 'No disponible';
  if (product.precioConIva != null && product.precioConIva !== '') {
    const num = Number(String(product.precioConIva).replace(',', '.'));
    if (Number.isFinite(num) && num > 0) return `Catálogo c/IVA: ${product.precioConIva} (antes de dto.)`;
  }
  const isOffer = product.oferta === 'si' || product.oferta === 'SI' || product.oferta === true;
  if (isOffer && product.precioOferta != null && product.precioOferta !== '') {
    const num = Number(String(product.precioOferta).replace(',', '.'));
    if (Number.isFinite(num) && num > 0) return `Catálogo oferta: ${product.precioOferta} (sin dto.)`;
  }
  if (product.usd != null && product.usd !== '' && String(product.usd) !== '0' && Number(product.usd) !== 0) {
    return `Catálogo USD ${product.usd} (sin cotización histórica)`;
  }
  if (product.price != null && product.price !== '' && Number(product.price) !== 0) {
    return `Catálogo lista: ${product.price} (antes de dto.)`;
  }
  return 'No disponible';
}

function CursorPagination({ hasPrevious, hasNext, loading, pageNumber, onPrevious, onNext }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2, py: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Página {pageNumber}
      </Typography>
      <Button type="button" size="small" disabled={loading || !hasPrevious} onClick={onPrevious}>
        Anterior
      </Button>
      <Button type="button" size="small" disabled={loading || !hasNext} onClick={onNext}>
        Siguientes
      </Button>
    </Stack>
  );
}

function PedidosToolbar({ onExportCsv, canExport, pageNumber, rowCount }) {
  return (
    <GridToolbarContainer
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1,
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <GridToolbarColumnsButton />
        <Button
          type="button"
          size="small"
          variant="outlined"
          disabled={!canExport}
          onClick={onExportCsv}
        >
          Exportar CSV (página actual)
        </Button>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Solo página {pageNumber} cargada ({rowCount} filas) · Búsqueda y filtros en servidor
      </Typography>
    </GridToolbarContainer>
  );
}

export default function ConsultaPedidos() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [applied, setApplied] = useState({});
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState('');
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});
  const detailRequest = useRef(0);

  useEffect(() => () => {
    detailRequest.current += 1;
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const params = { ...applied, ...(current ? { before: current } : {}) };
    axios
      .get(`${config.SERVER}/api/order/admin/list`, { params })
      .then(({ data }) => {
        if (active) {
          if (!Array.isArray(data.orders)) throw new Error();
          setRows(data.orders);
          setCursor(data.nextCursor || null);
        }
      })
      .catch(() => {
        if (active) {
          setRows([]);
          setCursor(null);
          setError('No se pudieron consultar los pedidos. Verificá los filtros y tus permisos.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [applied, current]);

  const buscar = e => {
    e.preventDefault();
    detailRequest.current += 1;
    setDetail(null);
    setDetailError('');
    setHistory([]);
    setCurrent(null);
    setApplied(
      Object.fromEntries(
        Object.entries(filters)
          .map(([k, v]) => [k, v.trim()])
          .filter(([, v]) => v)
      )
    );
  };

  const limpiar = () => {
    detailRequest.current += 1;
    setFilters(INITIAL_FILTERS);
    setApplied({});
    setHistory([]);
    setCurrent(null);
    setDetail(null);
    setDetailError('');
  };

  const abrir = async row => {
    const request = ++detailRequest.current;
    setDetail(null);
    setDetailError('');
    try {
      const r = await axios.get(`${config.SERVER}/api/order/id/${encodeURIComponent(row.id)}`);
      if (request === detailRequest.current) {
        setDetail({ order: r.data, status: r.data?.notificationStatus || row.notificationStatus });
      }
    } catch (_) {
      if (request === detailRequest.current) {
        setDetailError('No se pudo consultar el detalle.');
      }
    }
  };

  const irAnterior = () => {
    if (!history.length) return;
    detailRequest.current += 1;
    setCurrent(history[history.length - 1]);
    setHistory(history.slice(0, -1));
    setDetail(null);
    setDetailError('');
  };

  const irSiguiente = () => {
    if (!cursor) return;
    detailRequest.current += 1;
    setHistory([...history, current]);
    setCurrent(cursor);
    setDetail(null);
    setDetailError('');
  };

  const columns = useMemo(
    () => [
      {
        field: 'timestamp',
        headerName: 'Fecha',
        minWidth: 155,
        flex: 1,
        sortable: false,
        valueGetter: ({ row }) => fecha(row.timestamp),
      },
      {
        field: 'id',
        headerName: 'ID',
        minWidth: 205,
        flex: 1.2,
        sortable: false,
      },
      {
        field: 'email',
        headerName: 'Cliente',
        minWidth: 170,
        flex: 1.1,
        sortable: false,
      },
      {
        field: 'presupuesto',
        headerName: 'Tipo',
        minWidth: 100,
        flex: 0.6,
        sortable: false,
        valueGetter: ({ row }) => (row.presupuesto ? 'Presupuesto' : 'Pedido'),
      },
      {
        field: 'notificationStatus',
        headerName: 'Correo',
        minWidth: 190,
        flex: 1.2,
        sortable: false,
        valueGetter: ({ row }) => estado[row.notificationStatus] || estado.unavailable,
      },
      {
        field: 'acciones',
        headerName: '',
        minWidth: 120,
        sortable: false,
        hideable: false,
        align: 'right',
        renderCell: ({ row }) => (
          <Button type="button" size="small" variant="outlined" onClick={() => abrir(row)}>
            Ver detalle
          </Button>
        ),
      },
    ],
    []
  );

  const visibleExportCols = useMemo(
    () =>
      columns.filter(
        col => EXPORTABLE_FIELDS.has(col.field) && columnVisibilityModel[col.field] !== false
      ),
    [columns, columnVisibilityModel]
  );

  const exportarCsv = () => {
    const csv = buildOrdersCsv({ rows, columns, columnVisibilityModel });
    if (!csv) return;
    const pageNumber = history.length + 1;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `pedidos-pagina-${pageNumber}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const pricing = detail?.order?.historicalPricing;
  const productList = detail?.order?.productList || [];
  const hasVerifiedPricing =
    pricing?.status === 'verified' &&
    Array.isArray(pricing.items) &&
    pricing.items.length === productList.length;

  return (
    <Box component="main" sx={{ minWidth: 0 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pedidos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Consulta y conciliación: la aceptación del correo no confirma su recepción ni la preparación del pedido.
      </Typography>

      <Paper component="form" variant="outlined" onSubmit={buscar} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
          <TextField
            size="small"
            label="ID del pedido"
            value={filters.id}
            onChange={e => setFilters({ ...filters, id: e.target.value })}
            sx={{ minWidth: { xs: '100%', sm: 210 }, flex: { sm: '1 1 210px' } }}
          />
          <TextField
            size="small"
            label="Correo del cliente"
            value={filters.email}
            onChange={e => setFilters({ ...filters, email: e.target.value })}
            sx={{ minWidth: { xs: '100%', sm: 210 }, flex: { sm: '1 1 210px' } }}
          />
          <TextField
            size="small"
            label="Desde"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.from}
            onChange={e => setFilters({ ...filters, from: e.target.value })}
            sx={{ minWidth: { xs: '100%', sm: 155 } }}
          />
          <TextField
            size="small"
            label="Hasta"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={filters.to}
            onChange={e => setFilters({ ...filters, to: e.target.value })}
            sx={{ minWidth: { xs: '100%', sm: 155 } }}
          />
          <TextField
            select
            size="small"
            label="Tipo"
            value={filters.type}
            onChange={e => setFilters({ ...filters, type: e.target.value })}
            sx={{ minWidth: { xs: '100%', sm: 145 } }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="order">Pedido</MenuItem>
            <MenuItem value="quote">Presupuesto</MenuItem>
          </TextField>
          <TextField
            select
            size="small"
            label="Estado de correo"
            value={filters.notificationStatus}
            onChange={e => setFilters({ ...filters, notificationStatus: e.target.value })}
            sx={{ minWidth: { xs: '100%', sm: 220 } }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="pending">Pendiente de envío</MenuItem>
            <MenuItem value="sending">Enviando</MenuItem>
            <MenuItem value="accepted">Aceptado por el proveedor</MenuItem>
            <MenuItem value="review">Requiere revisión</MenuItem>
            <MenuItem value="unavailable">Sin información de correo</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" disabled={loading}>
            Buscar
          </Button>
          <Button type="button" variant="outlined" disabled={loading} onClick={limpiar}>
            Limpiar
          </Button>
        </Box>
      </Paper>

      {loading && (
        <Typography role="status" variant="body2" sx={{ mb: 1 }}>
          Cargando pedidos…
        </Typography>
      )}
      {error && (
        <Alert severity="error" role="alert" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!error && (
        <Box sx={{ height: 560, width: '100%', minWidth: 0 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={row => row.id}
            loading={loading}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            rowCount={rows.length}
            paginationModel={FIXED_PAGINATION_MODEL}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={setColumnVisibilityModel}
            disableColumnFilter
            disableColumnMenu
            disableDensitySelector
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            columnBuffer={6}
            disableVirtualization={process.env.NODE_ENV === 'test'}
            localeText={LOCALE_TEXT}
            slots={{
              toolbar: PedidosToolbar,
              pagination: CursorPagination,
            }}
            slotProps={{
              toolbar: {
                onExportCsv: exportarCsv,
                canExport: !loading && rows.length > 0 && visibleExportCols.length > 0,
                pageNumber: history.length + 1,
                rowCount: rows.length,
              },
              pagination: {
                hasPrevious: history.length > 0,
                hasNext: Boolean(cursor),
                loading,
                pageNumber: history.length + 1,
                onPrevious: irAnterior,
                onNext: irSiguiente,
              },
            }}
          />
        </Box>
      )}

      {detailError && (
        <Alert severity="error" role="alert" sx={{ mt: 2 }}>
          {detailError}
        </Alert>
      )}

      {detail && (
        <Paper component="section" variant="outlined" sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Pedido {detail.order._id || detail.order.id}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Fecha: {fecha(detail.order.timestamp)} · Cliente: {detail.order.email} ·{' '}
            {detail.order.presupuesto ? 'Presupuesto' : 'Pedido'} ·{' '}
            {estado[detail.status] || estado.unavailable}
          </Typography>

          {hasVerifiedPricing ? (
            <Alert severity="success" sx={{ mb: 1.5 }}>
              Importes históricos verificados desde la notificación original de la operación (ARS neto sin IVA).
            </Alert>
          ) : (
            <Alert severity="warning" sx={{ mb: 1.5 }}>
              No hay precio histórico verificable para esta operación. No se reconstruye con precios, descuentos ni cotización vigentes.
            </Alert>
          )}

          {hasVerifiedPricing && pricing.sections?.einhell?.listDiscountNotice && (
            <Alert severity="info" sx={{ mb: 1.5 }}>
              Nota original de Einhell / KWB: los importes históricos de esa sección son precios de lista (sujetos al descuento 23%+5% informado en el correo).
            </Alert>
          )}

          <TableContainer component={Paper} variant="outlined" sx={{ width: '100%', overflowX: 'auto' }}>
            <Table size="small" aria-label="Detalle de productos del pedido">
              <TableHead>
                <TableRow>
                  <TableCell>Código</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell align="right">Cantidad</TableCell>
                  <TableCell align="right">
                    {hasVerifiedPricing
                      ? 'Precio unit. histórico (ARS neto)'
                      : 'Importe histórico verificado'}
                  </TableCell>
                  <TableCell align="right">IVA</TableCell>
                  <TableCell align="right">
                    {hasVerifiedPricing
                      ? 'Subtotal línea (ARS neto)'
                      : 'Referencia catálogo al guardar (no es importe final)'}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList.map((p, i) => {
                  const verifiedItem = hasVerifiedPricing ? pricing.items[i] : null;
                  return (
                    <TableRow key={i}>
                      <TableCell>{p.code}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell align="right">{p.qty}</TableCell>
                      <TableCell align="right">
                        {verifiedItem ? formatArs(verifiedItem.unitNetPrice) : 'No disponible'}
                      </TableCell>
                      <TableCell align="right">
                        {verifiedItem ? `${verifiedItem.ivaPercent}%` : formatIva(p.iva)}
                      </TableCell>
                      <TableCell align="right">
                        {verifiedItem
                          ? formatArs(verifiedItem.lineNetSubtotal)
                          : formatCatalogReference(p)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {hasVerifiedPricing && pricing.totals && (
                  <>
                    <TableRow>
                      <TableCell colSpan={5} align="right">
                        <strong>Subtotal histórico (ARS neto)</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{formatArs(pricing.totals.subtotal)}</strong>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} align="right">
                        <strong>IVA histórico (ARS)</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{formatArs(pricing.totals.iva)}</strong>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} align="right">
                        <strong>TOTAL histórico (ARS)</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{formatArs(pricing.totals.total)}</strong>
                      </TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Los importes históricos verificados provienen del comprobante de correo generado al confirmar la operación y no reemplazan a la facturación definitiva.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
