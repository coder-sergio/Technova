import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import NotFound from '../pages/NotFound'
import { Navigate } from 'react-router-dom'

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
    }
]

const privateRoutes = [
    {
        path: '/dashboard',
        element: <Dashboard />,
    }
]

export { publicRoutes, privateRoutes }