import { useState } from 'react'
import { brand } from '../config/brand'

// Image slot: shimmer while loading, branded fallback when there is no src or it fails to load.
export default function Photo({ src, alt = '', className = '', label, rounded = 'rounded-xl' }) {
  const [state, setState] = useState(src ? 'loading' : 'fallback')

  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`}>
      {state !== 'fallback' && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setState('loaded')}
          onError={() => setState('fallback')}
          className={`h-full w-full object-cover transition duration-500 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {state === 'loading' && <div className="skeleton absolute inset-0" />}
      {state === 'fallback' && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800" role={alt ? 'img' : undefined} aria-label={alt || undefined}>
          <div className="absolute -top-1/2 -right-1/4 h-full w-3/4 rounded-full bg-accent-600/30 blur-2xl" />
          <img src={brand.logo.white} alt="" aria-hidden="true" className="absolute top-1/2 left-1/2 w-1/2 max-w-40 -translate-x-1/2 -translate-y-1/2 opacity-20" />
        </div>
      )}
      {label && <span className="chip absolute bottom-2 left-2 bg-black/35 text-white backdrop-blur">{label}</span>}
    </div>
  )
}
