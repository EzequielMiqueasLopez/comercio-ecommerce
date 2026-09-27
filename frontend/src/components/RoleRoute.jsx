import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege una ruta tanto por autenticación como por rol.
 * Si el usuario no tiene un rol permitido, lo manda a una página
 * a la que sí tenga acceso (o a /login si ni eso).
 */
export function RoleRoute({ roles, children }) {
  const { usuario, autenticado } = useAuth();

  if (!autenticado) return <Navigate to="/login" replace />;

  if (!roles.includes(usuario.rol)) {
    const destino = usuario.rol === 'pedidos' ? '/pedidos' : '/productos';
    return <Navigate to={destino} replace />;
  }

  return children;
}
