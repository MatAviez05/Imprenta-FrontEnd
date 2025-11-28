import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ClientsPage from './pages/ClientsPage';
import TodosPedidosPage from './pages/TodosPedidos';
import HomePage from './pages/HomePage';
import ReportsPage from './pages/ReportsPage';

import './App.css'


function App() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <h2>Cargando...</h2>
      </div>
    );
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to='/' replace/> : <LoginPage/>}
        />
        
        <Route
          path='/'
          element={user ? <HomePage /> : <Navigate to="/login" replace />}
        />

        <Route
          path='/pedidos'
          element={user ? <TodosPedidosPage /> : <Navigate to="/login" replace />}
        />

        <Route
          path='/clients'
          element={user ? <ClientsPage /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/reportes"
          element={<ReportsPage/>}
        />

        <Route
          path="/facturacion"
        /*  element={<FacturacionPage />} */
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
