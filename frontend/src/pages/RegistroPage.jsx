import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RegistroPage() {
  const { registrar, cargando } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: 'productos' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const actualizarCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registrar(form);
      setExito(true);
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-caja">
        <h1>Crea tu cuenta</h1>
        <p className="subt">La contraseña necesita mayúscula, número y 8+ caracteres.</p>

        {error && <div className="mensaje-error">{error}</div>}
        {exito && <div className="mensaje-exito">Cuenta creada. Redirigiendo a inicio de sesión…</div>}

        <form onSubmit={enviar}>
          <div className="campo">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" required value={form.nombre} onChange={actualizarCampo('nombre')} />
          </div>
          <div className="campo">
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" required value={form.email} onChange={actualizarCampo('email')} />
          </div>
          <div className="campo">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" required value={form.password} onChange={actualizarCampo('password')} />
          </div>
          <div className="campo">
            <label htmlFor="rol">Rol</label>
            <select id="rol" value={form.rol} onChange={actualizarCampo('rol')}>
              <option value="admin">Administrador (acceso total)</option>
              <option value="productos">Solo ve productos</option>
              <option value="pedidos">Solo ve pedidos</option>
            </select>
          </div>
          <button className="btn btn-primario" type="submit" disabled={cargando} style={{ width: '100%' }}>
            {cargando ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-alt">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
