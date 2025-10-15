// src/routes/PrivateRoute.tsx
import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
};

export default function PrivateRoute({ children }: { children: JSX.Element }) {

  const user = getCurrentUser();
  return user ? children : <Navigate to="/login" replace />;
}
