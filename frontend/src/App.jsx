import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleRoute } from './components/RoleRoute';
import { LoginPage } from './pages/LoginPage';
import { RegistroPage } from './pages/RegistroPage';
import { ProductosPage } from './pages/ProductosPage';
import { PedidosPage } from './pages/PedidosPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route
            path="/productos"
            element={
              <RoleRoute roles={['admin', 'productos']}>
                <ProductosPage />
              </RoleRoute>
            }
          />
          <Route
            path="/pedidos"
            element={
              <RoleRoute roles={['admin', 'pedidos']}>
                <PedidosPage />
              </RoleRoute>
            }
          />
          <Route path="*" element={<Navigate to="/productos" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
