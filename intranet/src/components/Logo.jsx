import { brand } from '../config/brand'

// onDark: always use the white logo (e.g. navy sidebar).
// Otherwise the navy logo is shown, swapping to white in dark mode.
export default function Logo({ onDark = false, className = 'h-9 w-auto' }) {
  if (onDark) return <img src={brand.logo.white} alt={brand.name} className={className} />
  return (
    <>
      <img src={brand.logo.navy} alt={brand.name} className={`${className} dark:hidden`} />
      <img src={brand.logo.white} alt="" aria-hidden="true" className={`${className} hidden dark:block`} />
    </>
  )
}
