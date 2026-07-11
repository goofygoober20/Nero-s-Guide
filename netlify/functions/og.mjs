export default async (request) => {
  try {
    const url = new URL(request.url)
    const title = url.searchParams.get('title') || "Nero's Index"
    const emoji = url.searchParams.get('emoji') || '📄'
    const accent = url.searchParams.get('accent') || '#1A7A39'

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f0f0f"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </linearGradient>
    <linearGradient id="accentBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.4"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Grid pattern -->
  <g opacity="0.03">
    <line x1="100" y1="0" x2="100" y2="630" stroke="#fff" stroke-width="1"/>
    <line x1="300" y1="0" x2="300" y2="630" stroke="#fff" stroke-width="1"/>
    <line x1="500" y1="0" x2="500" y2="630" stroke="#fff" stroke-width="1"/>
    <line x1="700" y1="0" x2="700" y2="630" stroke="#fff" stroke-width="1"/>
    <line x1="900" y1="0" x2="900" y2="630" stroke="#fff" stroke-width="1"/>
    <line x1="1100" y1="0" x2="1100" y2="630" stroke="#fff" stroke-width="1"/>
  </g>

  <!-- Accent bar at top -->
  <rect width="1200" height="6" fill="url(#accentBar)"/>

  <!-- Accent circle (decorative) -->
  <circle cx="1050" cy="150" r="180" fill="${accent}" opacity="0.06"/>

  <!-- Emoji -->
  <text x="100" y="340" font-size="120" font-family="system-ui, -apple-system, sans-serif" dominant-baseline="central">${emoji}</text>

  <!-- Title -->
  <text x="260" y="340" font-size="48" font-family="system-ui, -apple-system, sans-serif" font-weight="700" fill="#ffffff" dominant-baseline="central" textLength="800" lengthAdjust="spacing">
    ${escapeXml(title)}
  </text>

  <!-- Subtitle line -->
  <line x1="260" y1="390" x2="260" y2="390" stroke="${accent}" stroke-width="4" stroke-linecap="round" opacity="0.8"/>

  <!-- Brand bar at bottom -->
  <rect x="100" y="510" width="1000" height="1" fill="#333" opacity="0.5"/>

  <!-- Logo text -->
  <text x="100" y="565" font-size="22" font-family="system-ui, -apple-system, sans-serif" font-weight="600" fill="${accent}">Nero's Index</text>

  <!-- Domain -->
  <text x="1100" y="565" font-size="18" font-family="system-ui, -apple-system, sans-serif" fill="#666" text-anchor="end">ner0.netlify.app</text>
</svg>`

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    return new Response('OG image generation failed', { status: 500 })
  }
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export const config = {
  path: '/api/og',
}
