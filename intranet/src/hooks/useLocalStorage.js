import { useEffect, useState } from 'react'

function read(key, initial) {
  try {
    const stored = localStorage.getItem(key)
    return stored === null ? initial : JSON.parse(stored)
  } catch {
    return initial
  }
}

// State mirrored to localStorage. If `key` changes (e.g. a per-person key), the new key's value is loaded.
export function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => ({ key, value: read(key, initial) }))
  let current = state
  if (state.key !== key) {
    current = { key, value: read(key, initial) }
    setState(current)
  }

  useEffect(() => {
    try {
      localStorage.setItem(current.key, JSON.stringify(current.value))
    } catch {
      // storage unavailable (private mode); keep in-memory state
    }
  }, [current.key, current.value])

  const setValue = (next) =>
    setState((s) => ({ key: s.key, value: typeof next === 'function' ? next(s.value) : next }))

  return [current.value, setValue]
}
