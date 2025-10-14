import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './routes/router'

createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
    <BrowserRouter>
      <StrictMode>
        <Routes>
          {publicRoutes.map((route) => (
            <Route path={route.path} element={route.element} />
          ))}
          {privateRoutes.map((route) => (
            <Route path={route.path} element={route.element} />
          ))}
        </Routes>
      </StrictMode>
    </BrowserRouter>
  </PrimeReactProvider>,
)
