import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectRoute';
//Páginas da aplicação
import Login from './pages/User/Login';
import Home from './pages/Home/Home';
import New from './pages/Tasks/New'
//Página de rota não encontrada
import NotFound from './pages/NotFound';
import { UserAuthContextProvider } from './context/UserAuthContext';

export default function Routers() {
  return (
    <UserAuthContextProvider>
      <Routes>
        <Route path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/New"
          element={
            <ProtectedRoute>
              <New />
            </ProtectedRoute>
          }
        />
         <Route path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </UserAuthContextProvider>
  );
}