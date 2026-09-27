import { httpClient } from './httpClient';

export const productoService = {
  listar: () => httpClient.get('/productos'),
  obtener: (id) => httpClient.get(`/productos/${id}`),
  crear: (datos) => httpClient.post('/productos', datos),
  actualizar: (id, datos) => httpClient.put(`/productos/${id}`, datos),
  eliminar: (id) => httpClient.delete(`/productos/${id}`)
};
