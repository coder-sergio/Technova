// src/routes/routes.tsx
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';
import { Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; // Ajusta la ruta según donde esté tu archivo

const publicRoutes = [
  {
    path: '/',
    element: <Navigate to="/login" />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const privateRoutes = [
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
];

export { publicRoutes, privateRoutes };
