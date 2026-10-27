import { createPortal } from 'react-dom'

// Renders overlays on document.body so animated (transformed) ancestors can't clip fixed positioning.
export default function Portal({ children }) {
  return createPortal(children, document.body)
}
