import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ConsultaPedidos from './ConsultaPedidos';

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
});

test('muestra listado paginado en DataGrid solo lectura y consulta el detalle sin modificar pedidos', async () => {
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
            productList: [{ code: 'X', name: 'Herramienta', qty: 2, usd: 15, iva: 21 }],
          },
        })
  );

  render(<ConsultaPedidos />);

  expect(await screen.findByRole('grid')).toBeInTheDocument();
  expect(await screen.findByText('cliente@example.test')).toBeInTheDocument();
  expect(screen.getByText(/Aceptado por el proveedor/)).toBeInTheDocument();
  expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  expect(screen.getByRole('grid').querySelectorAll('input').length).toBe(0);

  const headers = screen.getAllByRole('columnheader').map(h => h.textContent?.trim() || '');
  expect(headers).toEqual(['Fecha', 'ID', 'Cliente', 'Tipo', 'Correo', '']);

  fireEvent.click(screen.getByText('Ver detalle'));
  expect(await screen.findByText('Herramienta')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText('USD 15')).toBeInTheDocument();
  expect(screen.getByText('21')).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledTimes(2);
  expect(axios.post).not.toHaveBeenCalled();
  expect(axios.put).not.toHaveBeenCalled();
  expect(axios.patch).not.toHaveBeenCalled();
  expect(axios.delete).not.toHaveBeenCalled();
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

test('aplica filtros en el servidor, deshabilita orden local y navega cursores sin mezclar resultados', async () => {
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

  // Clic en encabezado no debe reordenar ni disparar consultas nuevas
  const callsBeforeClick = axios.get.mock.calls.length;
  fireEvent.click(screen.getByRole('columnheader', { name: 'Cliente' }));
  expect(axios.get).toHaveBeenCalledTimes(callsBeforeClick);
  const emailsBefore = screen.getAllByRole('row').slice(1).map(r => r.textContent);
  expect(emailsBefore[0]).toContain('uno@example.test');
  expect(emailsBefore[1]).toContain('tres@example.test');

  fireEvent.click(screen.getByRole('button', { name: 'Siguientes' }));
  expect(await screen.findByText('dos@example.test')).toBeInTheDocument();
  expect(screen.getByText('Página 2')).toBeInTheDocument();
  expect(screen.getByText('Presupuesto')).toBeInTheDocument();
  expect(screen.queryByText('uno@example.test')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Anterior' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Siguientes' })).toBeDisabled();

  fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
  expect(await screen.findByText('uno@example.test')).toBeInTheDocument();
  expect(screen.getByText('Página 1')).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Correo del cliente'), { target: { value: ' uno@example.test ' } });
  fireEvent.change(screen.getByLabelText('Desde'), { target: { value: '2026-11-16' } });
  fireEvent.click(screen.getByText('Buscar'));

  await waitFor(() =>
    expect(axios.get).toHaveBeenLastCalledWith(expect.stringContaining('/admin/list'), {
      params: { email: 'uno@example.test', from: '2026-11-16' },
    })
  );
  expect(await screen.findByRole('button', { name: 'Anterior' })).toBeDisabled();
});
