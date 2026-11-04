import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { IconContext } from '@phosphor-icons/react'
import App from './App'
import { ToastProvider } from './components/Toast'
import { UserProvider } from './context/UserContext'
import './index.css'

// The shareable preview is hosted where URL paths can't change, so it routes in memory.
const Router = import.meta.env.MODE === 'preview' ? MemoryRouter : BrowserRouter

// Apply the saved theme before first paint, so screens outside the main layout (sign-in, onboarding) match it too.
try {
  document.documentElement.classList.toggle('dark', JSON.parse(localStorage.getItem('rex-dark') ?? 'false') === true)
} catch {
  // storage unavailable: stay light
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <IconContext.Provider value={{ size: 24, weight: 'regular' }}>
      <Router>
        <UserProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </UserProvider>
      </Router>
    </IconContext.Provider>
  </StrictMode>,
)
