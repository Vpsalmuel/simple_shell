import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toast = useCallback((message) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="animate-fade-up flex items-center gap-2 rounded-xl bg-brand-900 px-4 py-3 text-sm text-white shadow-xl">
            <CheckCircle2 size={16} className="text-accent-400" /> {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
