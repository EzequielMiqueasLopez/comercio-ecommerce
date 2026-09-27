/**
 * Adaptador de red aislado: único punto del frontend que sabe hacer
 * fetch() y construir la URL base. Los "services" (auth, producto,
 * pedido) usan esto y nunca llaman a fetch directamente, así que si
 * mañana cambiamos de fetch a axios, solo se toca este archivo.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function obtenerToken() {
  return localStorage.getItem('token');
}

async function request(path, { method = 'GET', body, autenticado = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (autenticado) {
    const token = obtenerToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(data.error || `Error en la petición (${respuesta.status})`);
  }

  return data;
}

export const httpClient = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts) => request(path, { ...opts, method: 'DELETE' })
};
