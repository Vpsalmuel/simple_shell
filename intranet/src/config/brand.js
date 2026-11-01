import logoNavy from '../assets/rex-logo-navy.svg'
import logoWhite from '../assets/rex-logo-white.svg'

// Company identity. Logo files live in src/assets.
export const brand = {
  name: 'Rex Insurance',
  shortName: 'Rex',
  product: 'Rex Hub',
  tagline: 'Protecting what matters, together.',
  logo: { navy: logoNavy, white: logoWhite },
}

// Third-party apps opened from Rex Hub. Optional: set `url` to add a "Continue to SeamlessHR" button.
export const externalApps = {
  seamlessHr: { name: 'SeamlessHR', url: null },
}

