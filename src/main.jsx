// Apply saved theme before render to prevent flash
document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'dark');

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
