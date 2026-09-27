import { httpClient } from './httpClient';

export const authService = {
  registrar(datos) {
    return httpClient.post('/usuarios/registro', datos, { autenticado: false });
  },
  login(credenciales) {
    return httpClient.post('/usuarios/login', credenciales, { autenticado: false });
  }
};
