import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from './components/Toast'
import { UserProvider } from './context/UserContext'
import './index.css'

// The shareable preview is hosted where URL paths can't change, so it routes in memory.
const Router = import.meta.env.MODE === 'preview' ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <UserProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </UserProvider>
    </Router>
  </StrictMode>,
)
