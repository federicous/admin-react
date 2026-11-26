import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ConsultaPedidos, { buildOrdersCsv, sanitizeCsvCell } from './ConsultaPedidos';

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
});

test('sanitizeCsvCell y buildOrdersCsv neutralizan fórmulas, respetan columnas visibles y excluyen acciones', () => {
  expect(sanitizeCsvCell('=CMD|"/C calc"!A0')).toBe(`"'=CMD|""/C calc""!A0"`);
  expect(sanitizeCsvCell('+1+1')).toBe(`"'+1+1"`);
  expect(sanitizeCsvCell('-2+3')).toBe(`"'-2+3"`);
  expect(sanitizeCsvCell('@SUM(A1:A2)')).toBe(`"'@SUM(A1:A2)"`);
  expect(sanitizeCsvCell('  =HYPERLINK("x")')).toBe(`"'  =HYPERLINK(""x"")"`);
  expect(sanitizeCsvCell('\t=1')).toBe(`"'\t=1"`);

  const columns = [
    { field: 'timestamp', headerName: 'Fecha' },
    { field: 'id', headerName: 'ID' },
    { field: 'email', headerName: 'Cliente' },
    { field: 'presupuesto', headerName: 'Tipo' },
    { field: 'notificationStatus', headerName: 'Correo' },
    { field: 'acciones', headerName: '' },
  ];
  const rows = [
    {
      id: 'ord1',
      email: '=evil@example.test',
      timestamp: 1700000000000,
      presupuesto: false,
      notificationStatus: 'accepted',
    },
  ];
  const csv = buildOrdersCsv({
    rows,
    columns,
    columnVisibilityModel: { timestamp: false, notificationStatus: false },
  });

  expect(csv.startsWith('\uFEFFID,Cliente,Tipo\r\n')).toBe(true);
  expect(csv).toContain(`ord1,"'=evil@example.test",Pedido`);
  expect(csv).not.toContain('Fecha');
  expect(csv).not.toContain('Aceptado');
  expect(csv).not.toContain('Ver detalle');
});

test('muestra DataGrid solo lectura, toolbar MUI y detalle con importe histórico verificado', async () => {
  axios.get.mockImplementation(url =>
    url.includes('/admin/list')
      ? Promise.resolve({
          data: {
            orders: [
              {
                id: 'abc',
                email: 'cliente@example.test',
                timestamp: 1700000000000,
                presupuesto: false,
                notificationStatus: 'accepted',
              },
            ],
            nextCursor: null,
          },
        })
      : Promise.resolve({
          data: {
            _id: 'abc',
            email: 'cliente@example.test',
            timestamp: 1700000000000,
            notificationStatus: 'accepted',
            productList: [
              { code: 'X', name: 'Herramienta', qty: 2, usd: 15, price: 0, iva: 21 },
              { code: 'E1', name: 'Taladro Einhell', lista: 'einhell', qty: 1, price: 500, iva: 21 },
            ],
            historicalPricing: {
              status: 'verified',
              source: 'notification_html',
              currency: 'ARS',
              priceBasis: 'net_unit_without_iva',
              items: [
                { index: 0, code: 'X', qty: 2, unitNetPrice: 1200, ivaPercent: 21, lineNetSubtotal: 2400, section: 'other' },
                { index: 1, code: 'E1', qty: 1, unitNetPrice: 450, ivaPercent: 21, lineNetSubtotal: 450, section: 'einhell' },
              ],
              sections: {
                other: { subtotal: 2400, iva: 504, total: 2904 },
                einhell: { subtotal: 450, iva: 94.5, total: 544.5, listDiscountNotice: true },
              },
              totals: { subtotal: 2850, iva: 598.5, total: 3448.5 },
            },
          },
        })
  );

  render(<ConsultaPedidos />);

  expect(await screen.findByRole('grid')).toBeInTheDocument();
  expect(await screen.findByText('cliente@example.test')).toBeInTheDocument();
  expect(screen.getByText(/Aceptado por el proveedor/)).toBeInTheDocument();
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  expect(screen.getByRole('grid').querySelectorAll('input').length).toBe(0);
  expect(screen.getByRole('button', { name: 'Exportar CSV (página actual)' })).toBeEnabled();
  expect(screen.getByText(/Solo página 1 cargada/)).toBeInTheDocument();

  const headers = screen.getAllByRole('columnheader').map(h => h.textContent?.trim() || '');
  expect(headers).toEqual(['Fecha', 'ID', 'Cliente', 'Tipo', 'Correo', '']);

  fireEvent.click(screen.getByText('Ver detalle'));
  expect(await screen.findByText('Herramienta')).toBeInTheDocument();
  expect(screen.getByText(/Importes históricos verificados desde la notificación original/)).toBeInTheDocument();
  expect(screen.getByText(/Nota original de Einhell \/ KWB/)).toBeInTheDocument();
  expect(screen.getByText(/1\.200,00/)).toBeInTheDocument();
  expect(screen.getByText(/3\.448,50/)).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledTimes(2);
  expect(axios.post).not.toHaveBeenCalled();
  expect(axios.put).not.toHaveBeenCalled();
  expect(axios.patch).not.toHaveBeenCalled();
  expect(axios.delete).not.toHaveBeenCalled();
});

test('cuando no hay precio histórico verificable muestra no disponible y referencia sin presentar como final', async () => {
  axios.get.mockImplementation(url =>
    url.includes('/admin/list')
      ? Promise.resolve({
          data: {
            orders: [
              {
                id: 'legacy1',
                email: 'legacy@example.test',
                timestamp: 1700000000000,
                presupuesto: false,
                notificationStatus: 'unavailable',
              },
            ],
            nextCursor: null,
          },
        })
      : Promise.resolve({
          data: {
            _id: 'legacy1',
            email: 'legacy@example.test',
            timestamp: 1700000000000,
            notificationStatus: 'unavailable',
            productList: [
              { code: 'C1', name: 'Con IVA', qty: 1, price: 999, precioConIva: '1210.00', iva: '21' },
              { code: 'O1', name: 'Oferta', qty: 1, price: 800, oferta: 'si', precioOferta: '650.00', usd: 5, iva: '21' },
              { code: 'U1', name: 'En USD', qty: 1, price: 0, usd: 12, iva: '10,5' },
              { code: 'L1', name: 'Solo lista', qty: 1, price: 300, usd: 0, iva: '21' },
            ],
            historicalPricing: { status: 'unavailable', source: 'none', reason: 'missing_notification_html' },
          },
        })
  );

  render(<ConsultaPedidos />);
  fireEvent.click(await screen.findByText('Ver detalle'));

  expect(await screen.findByText(/No hay precio histórico verificable para esta operación/)).toBeInTheDocument();
  expect(screen.getByText(/Catálogo c\/IVA: 1210\.00 \(antes de dto\.\)/)).toBeInTheDocument();
  expect(screen.getByText(/Catálogo oferta: 650\.00 \(sin dto\.\)/)).toBeInTheDocument();
  expect(screen.getByText(/Catálogo USD 12 \(sin cotización histórica\)/)).toBeInTheDocument();
  expect(screen.getByText(/Catálogo lista: 300 \(antes de dto\.\)/)).toBeInTheDocument();
  expect(screen.getAllByText('No disponible').length).toBeGreaterThanOrEqual(4);
});

test('gestión de columnas y exportación CSV descargan solo página actual y columnas visibles', async () => {
  axios.get.mockResolvedValue({
    data: {
      orders: [
        {
          id: 'ord-csv',
          email: '=danger@example.test',
          timestamp: 1700000000000,
          presupuesto: true,
          notificationStatus: 'review',
        },
      ],
      nextCursor: 'next-1',
    },
  });

  const blobs = [];
  const origBlob = global.Blob;
  global.Blob = function MockBlob(parts, opts) {
    blobs.push(parts.join(''));
    return new origBlob(parts, opts);
  };
  global.URL.createObjectURL = jest.fn(() => 'blob:csv-test');
  global.URL.revokeObjectURL = jest.fn();
  const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

  try {
    render(<ConsultaPedidos />);
    expect(await screen.findByText('=danger@example.test')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Columnas/i }));
    const idSwitch = await screen.findByRole('checkbox', { name: 'ID' });
    fireEvent.click(idSwitch);

    fireEvent.click(screen.getByRole('button', { name: 'Exportar CSV (página actual)' }));
    expect(blobs.length).toBe(1);
    expect(blobs[0]).toContain('Fecha,Cliente,Tipo,Correo');
    expect(blobs[0]).not.toContain(',ID,');
    expect(blobs[0]).toContain(`"'=danger@example.test"`);
    expect(blobs[0]).toContain('Presupuesto');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  } finally {
    clickSpy.mockRestore();
    global.Blob = origBlob;
  }
});

test('muestra error sin presentar lista como vacía', async () => {
  axios.get.mockRejectedValue(new Error('forbidden'));
  render(<ConsultaPedidos />);

  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron consultar');
  await waitFor(() => expect(screen.queryByText('No se encontraron pedidos.')).not.toBeInTheDocument());
  expect(screen.queryByRole('grid')).not.toBeInTheDocument();
});

test('muestra estado vacío cuando el servidor devuelve cero pedidos sin error', async () => {
  axios.get.mockResolvedValue({ data: { orders: [], nextCursor: null } });
  render(<ConsultaPedidos />);

  expect(await screen.findByText('No se encontraron pedidos.')).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Exportar CSV (página actual)' })).toBeDisabled();
});

test('una respuesta tardía no reemplaza el último detalle elegido', async () => {
  let resolveFirst;
  const first = new Promise(resolve => {
    resolveFirst = resolve;
  });
  axios.get.mockImplementation(url => {
    if (url.includes('/admin/list')) {
      return Promise.resolve({
        data: {
          orders: [
            { id: 'one', email: 'one@example.test', timestamp: 1700000000000 },
            { id: 'two', email: 'two@example.test', timestamp: 1700000000001 },
          ],
          nextCursor: null,
        },
      });
    }
    if (url.endsWith('/one')) return first;
    return Promise.resolve({ data: { _id: 'two', email: 'two@example.test', productList: [] } });
  });

  render(<ConsultaPedidos />);
  const buttons = await screen.findAllByText('Ver detalle');
  fireEvent.click(buttons[0]);
  fireEvent.click(buttons[1]);

  expect(await screen.findByRole('heading', { name: 'Pedido two' })).toBeInTheDocument();
  resolveFirst({ data: { _id: 'one', email: 'one@example.test', productList: [] } });
  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Pedido one' })).not.toBeInTheDocument());
  expect(screen.getByRole('heading', { name: 'Pedido two' })).toBeInTheDocument();
});

test('muestra error si falla la consulta de detalle', async () => {
  axios.get.mockImplementation(url =>
    url.includes('/admin/list')
      ? Promise.resolve({
          data: { orders: [{ id: 'abc', email: 'cliente@example.test', timestamp: 1700000000000 }], nextCursor: null },
        })
      : Promise.reject(new Error('network'))
  );

  render(<ConsultaPedidos />);
  fireEvent.click(await screen.findByText('Ver detalle'));
  expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo consultar el detalle.');
});

test('aplica filtros combinados en servidor (incluyendo tipo y estado), limpia filtros y navega cursores', async () => {
  axios.get.mockImplementation((_url, { params }) =>
    Promise.resolve({
      data: params.before
        ? {
            orders: [{ id: 'dos', email: 'dos@example.test', timestamp: 1700000000002, presupuesto: 'si' }],
            nextCursor: null,
          }
        : {
            orders: [
              { id: 'uno', email: 'uno@example.test', timestamp: 1700000000001, presupuesto: false },
              { id: 'tres', email: 'tres@example.test', timestamp: 1700000000000, presupuesto: false },
            ],
            nextCursor: 'cursor1',
          },
    })
  );

  render(<ConsultaPedidos />);
  expect(await screen.findByText('uno@example.test')).toBeInTheDocument();
  expect(screen.getByText('Página 1')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Siguientes' })).toBeEnabled();

  const callsBeforeClick = axios.get.mock.calls.length;
  fireEvent.click(screen.getByRole('columnheader', { name: 'Cliente' }));
  expect(axios.get).toHaveBeenCalledTimes(callsBeforeClick);

  fireEvent.click(screen.getByRole('button', { name: 'Siguientes' }));
  expect(await screen.findByText('dos@example.test')).toBeInTheDocument();
  expect(screen.getByText('Página 2')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Anterior' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Siguientes' })).toBeDisabled();

  fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
  expect(await screen.findByText('uno@example.test')).toBeInTheDocument();

  const form = document.querySelector('form');
  fireEvent.change(within(form).getByLabelText('Correo del cliente'), { target: { value: ' uno@example.test ' } });
  fireEvent.change(within(form).getByLabelText('Desde'), { target: { value: '2026-11-16' } });

  fireEvent.mouseDown(within(form).getByLabelText('Tipo'));
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'Presupuesto' }));

  fireEvent.mouseDown(within(form).getByLabelText('Estado de correo'));
  fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'Requiere revisión' }));

  fireEvent.click(screen.getByRole('button', { name: 'Buscar' }));

  await waitFor(() =>
    expect(axios.get).toHaveBeenLastCalledWith(expect.stringContaining('/admin/list'), {
      params: {
        email: 'uno@example.test',
        from: '2026-11-16',
        type: 'quote',
        notificationStatus: 'review',
      },
    })
  );
  await waitFor(() => expect(screen.getByRole('button', { name: 'Limpiar' })).toBeEnabled());
  expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();

  fireEvent.click(screen.getByRole('button', { name: 'Limpiar' }));
  await waitFor(() =>
    expect(axios.get).toHaveBeenLastCalledWith(expect.stringContaining('/admin/list'), { params: {} })
  );
  await waitFor(() => expect(screen.getByRole('button', { name: 'Limpiar' })).toBeEnabled());
});
