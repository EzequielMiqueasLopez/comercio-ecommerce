import { createContext, useContext, useState, useCallback } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

function leerUsuarioGuardado() {
  const crudo = localStorage.getItem('usuario');
  return crudo ? JSON.parse(crudo) : null;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);
  const [cargando, setCargando] = useState(false);

  const login = useCallback(async (credenciales) => {
    setCargando(true);
    try {
      const { token, usuario: usuarioAutenticado } = await authService.login(credenciales);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuarioAutenticado));
      setUsuario(usuarioAutenticado);
      return usuarioAutenticado;
    } finally {
      setCargando(false);
    }
  }, []);

  const registrar = useCallback(async (datos) => {
    setCargando(true);
    try {
      return await authService.registrar(datos);
    } finally {
      setCargando(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }, []);

  const value = { usuario, cargando, login, registrar, logout, autenticado: Boolean(usuario) };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
