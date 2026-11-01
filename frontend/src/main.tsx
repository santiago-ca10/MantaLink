import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { PreferenciasProvider } from './context/PreferenciasContext';
import { ToastProvider } from './context/ToastContext';
import './styles/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PreferenciasProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </PreferenciasProvider>
    </BrowserRouter>
  </StrictMode>,
);
