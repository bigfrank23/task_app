import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { NotificationProvider } from './components/notification/NotificationProvider.jsx'
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import queryClient from './utils/queryClient.js'
import ErrorBoundary from './components/errorBoundary/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_URL_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <NotificationProvider maxSnack={5}>
          <ErrorBoundary>
             <App />
          </ErrorBoundary>
        </NotificationProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
