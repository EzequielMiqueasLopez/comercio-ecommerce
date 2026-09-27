import { httpClient } from './httpClient';

export const pedidoService = {
  listar: () => httpClient.get('/pedidos'),
  obtener: (id) => httpClient.get(`/pedidos/${id}`),
  crear: (datos) => httpClient.post('/pedidos', datos),
  actualizarEstado: (id, estado) => httpClient.patch(`/pedidos/${id}/estado`, { estado }),
  eliminar: (id) => httpClient.delete(`/pedidos/${id}`)
};
