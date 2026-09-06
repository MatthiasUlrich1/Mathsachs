/**
 * Local organisations that support Mathsachs.
 * Add a new entry here — footer and Einstellungen → Unterstützer pick it up.
 */
export interface Supporter {
  id: string
  name: string
  /** Official website. Footer logo and settings name become a link when set. */
  url?: string
  /** Path under `public/`, relative to the Vite `base` (`./`). */
  logoSrc?: string
  logoAlt?: string
  /** Artwork drawn for a dark background — wrap it in a dark chip. */
  logoOnDark?: boolean
  /**
   * Show in Einstellungen → Unterstützer. Default true.
   * Set false for footer-only logos without a settings row.
   */
  listed?: boolean
  /** Show in the app footer. Default true when `logoSrc` is set. */
  footer?: boolean
}

export const SUPPORTERS: readonly Supporter[] = [
  {
    id: 'bi-menschenskinder',
    name: 'Bürgerinitiative Menschenskinder Delitzsch! e.V.',
    url: 'https://www.bi-menschenskinder-delitzsch.de/',
    logoSrc: './supporters/logo-bi-menschenskinder.png',
    logoAlt:
      'Logo der Bürgerinitiative Menschenskinder Delitzsch! e.V. mit dem Motto „Du bist uns wichtig“ und den Schwerpunkten Gemeinschaft, Familie, Jugend.',
  },
  {
    id: 'mein-delitzsch',
    name: 'Mein Delitzsch',
    logoSrc: './supporters/logo-mein-delitzsch.png',
    logoAlt: 'Logo Mein Delitzsch',
    logoOnDark: true,
    listed: false,
  },
]

export const listedSupporters = (): readonly Supporter[] =>
  SUPPORTERS.filter((row) => row.listed !== false)

export const footerSupporters = (): readonly Supporter[] =>
  SUPPORTERS.filter((row) => Boolean(row.logoSrc) && row.footer !== false)
