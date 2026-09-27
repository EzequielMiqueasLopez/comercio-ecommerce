import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const salir = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="marca">Comercio</div>
      <nav>
        {(usuario?.rol === 'admin' || usuario?.rol === 'productos') && (
          <NavLink to="/productos" className={({ isActive }) => (isActive ? 'activo' : '')}>
            Catálogo
          </NavLink>
        )}
        {(usuario?.rol === 'admin' || usuario?.rol === 'pedidos') && (
          <NavLink to="/pedidos" className={({ isActive }) => (isActive ? 'activo' : '')}>
            Pedidos
          </NavLink>
        )}
        <button onClick={salir}>Cerrar sesión</button>
      </nav>
      <div className="usuario-info">
        {usuario?.nombre}
        <br />
        {usuario?.rol}
      </div>
    </aside>
  );
}
