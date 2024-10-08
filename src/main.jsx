import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from '@descope/react-sdk';

createRoot(document.getElementById('root')).render(
  <AuthProvider projectId="P2lLBXpqv8fNRZ7hdcoM1sDNTfgm">
      <App />
  </AuthProvider>
)
