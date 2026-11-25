import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
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

const LOCALE_TEXT = {
  ...esES.components.MuiDataGrid.defaultProps.localeText,
  noRowsLabel: 'No se encontraron pedidos.',
};

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

export default function ConsultaPedidos() {
  const [filters, setFilters] = useState({ id: '', email: '', from: '', to: '' });
  const [applied, setApplied] = useState({});
  const [rows, setRows] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState('');
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

  const abrir = async row => {
    const request = ++detailRequest.current;
    setDetail(null);
    setDetailError('');
    try {
      const r = await axios.get(`${config.SERVER}/api/order/id/${encodeURIComponent(row.id)}`);
      if (request === detailRequest.current) {
        setDetail({ order: r.data, status: row.notificationStatus });
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

  return (
    <main>
      <h1>Pedidos</h1>
      <p>
        Consulta y conciliación: la aceptación del correo no confirma su recepción ni la preparación del pedido.
      </p>
      <form onSubmit={buscar}>
        {[
          ['id', 'ID del pedido', 'text'],
          ['email', 'Correo del cliente', 'text'],
          ['from', 'Desde', 'date'],
          ['to', 'Hasta', 'date'],
        ].map(([key, label, type]) => (
          <label key={key} style={{ display: 'inline-block', marginRight: 12, maxWidth: '100%' }}>
            {label}
            <input
              type={type}
              style={{ maxWidth: '100%' }}
              value={filters[key]}
              onChange={e => setFilters({ ...filters, [key]: e.target.value })}
            />
          </label>
        ))}
        <button type="submit">Buscar</button>
      </form>
      {loading && <p role="status">Cargando pedidos…</p>}
      {error && <p role="alert">{error}</p>}
      {!error && (
        <Box sx={{ height: 520, width: '100%', minWidth: 0, mt: 2 }}>
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
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            columnBuffer={6}
            disableVirtualization={process.env.NODE_ENV === 'test'}
            localeText={LOCALE_TEXT}
            slots={{ pagination: CursorPagination }}
            slotProps={{
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
      {detailError && <p role="alert">{detailError}</p>}
      {detail && (
        <section>
          <h2>Pedido {detail.order._id || detail.order.id}</h2>
          <p>
            Fecha: {fecha(detail.order.timestamp)} · Cliente: {detail.order.email} ·{' '}
            {detail.order.presupuesto ? 'Presupuesto' : 'Pedido'} ·{' '}
            {estado[detail.status] || estado.unavailable}
          </p>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio registrado</th>
                  <th>IVA registrado</th>
                </tr>
              </thead>
              <tbody>
                {(detail.order.productList || []).map((p, i) => (
                  <tr key={i}>
                    <td>{p.code}</td>
                    <td>{p.name}</td>
                    <td>{p.qty}</td>
                    <td>
                      {p.price != null && p.price !== ''
                        ? String(p.price)
                        : p.usd != null && p.usd !== ''
                        ? `USD ${p.usd}`
                        : 'No disponible'}
                    </td>
                    <td>{p.iva != null && p.iva !== '' ? String(p.iva) : 'No disponible'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <p>Los precios son los datos guardados en el pedido; no representan necesariamente el total facturado.</p>
        </section>
      )}
    </main>
  );
}
