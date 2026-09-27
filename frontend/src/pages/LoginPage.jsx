import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, cargando } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const actualizarCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/productos');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-caja">
        <h1>Inicia sesión</h1>
        <p className="subt">Entra con tu correo y contraseña.</p>

        {error && <div className="mensaje-error">{error}</div>}

        <form onSubmit={enviar}>
          <div className="campo">
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" required value={form.email} onChange={actualizarCampo('email')} />
          </div>
          <div className="campo">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" required value={form.password} onChange={actualizarCampo('password')} />
          </div>
          <button className="btn btn-primario" type="submit" disabled={cargando} style={{ width: '100%' }}>
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="auth-alt">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
