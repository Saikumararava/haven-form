const FALLBACK_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <rect fill="#EDE6D9" width="1200" height="800"/>
    <rect x="80" y="80" width="1040" height="640" fill="none" stroke="#1E3A2F" stroke-width="2"/>
    <text x="600" y="390" text-anchor="middle" fill="#1E3A2F" font-family="Georgia, serif" font-size="36">Haven &amp; Form</text>
    <text x="600" y="430" text-anchor="middle" fill="#B8734A" font-family="sans-serif" font-size="16">Image unavailable — demo placeholder</text>
  </svg>`,
)

export const IMAGE_FALLBACK = `data:image/svg+xml;charset=utf-8,${FALLBACK_SVG}`

export function unsplash(id: string, width = 1600): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`
}
