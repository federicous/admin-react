import React from 'react';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ConsultaPedidos from './ConsultaPedidos';
jest.mock('axios');
test('muestra listado paginado y consulta el detalle sin modificar pedidos',async()=>{
  axios.get.mockImplementation(url=>url.includes('/admin/list')?Promise.resolve({data:{orders:[{id:'abc',email:'cliente@example.test',timestamp:1700000000000,presupuesto:false,notificationStatus:'accepted'}],nextCursor:null}}):Promise.resolve({data:{_id:'abc',email:'cliente@example.test',productList:[{code:'X',name:'Herramienta',qty:2}]}}));
  render(<ConsultaPedidos/>);
  expect(await screen.findByText('cliente@example.test')).toBeInTheDocument();
  expect(screen.getByText(/Aceptado por el proveedor/)).toBeInTheDocument();
  fireEvent.click(screen.getByText('Ver detalle'));
  expect(await screen.findByText('Herramienta')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledTimes(2);
});
test('muestra error sin presentar lista como vacía',async()=>{
  axios.get.mockReset();axios.get.mockRejectedValue(new Error('forbidden'));
  render(<ConsultaPedidos/>);expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron consultar');
  await waitFor(()=>expect(screen.queryByText('No se encontraron pedidos.')).not.toBeInTheDocument());
});
test('una respuesta tardía no reemplaza el último detalle elegido',async()=>{
  let resolveFirst; const first=new Promise(resolve=>{resolveFirst=resolve});
  axios.get.mockReset();axios.get.mockImplementation(url=>{
    if(url.includes('/admin/list'))return Promise.resolve({data:{orders:[{id:'one',email:'one@example.test',timestamp:1700000000000},{id:'two',email:'two@example.test',timestamp:1700000000001}],nextCursor:null}});
    if(url.endsWith('/one'))return first;
    return Promise.resolve({data:{_id:'two',email:'two@example.test',productList:[]}});
  });
  render(<ConsultaPedidos/>);const buttons=await screen.findAllByText('Ver detalle');fireEvent.click(buttons[0]);fireEvent.click(buttons[1]);
  expect(await screen.findByRole('heading',{name:'Pedido two'})).toBeInTheDocument();
  resolveFirst({data:{_id:'one',email:'one@example.test',productList:[]}});
  await waitFor(()=>expect(screen.queryByRole('heading',{name:'Pedido one'})).not.toBeInTheDocument());
  expect(screen.getByRole('heading',{name:'Pedido two'})).toBeInTheDocument();
});
