import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import ClientsPage from './pages/ClientsPage';

import './App.css'


function App() {
  const { user, isLoading } = useAuth()

  if(isLoading){
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
        path='/login'
        element={user ? <Navigate to='/' replace/> : <LoginPage/>}
        />

        <Route
          path='/clients'
          element={<ClientsPage/>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
