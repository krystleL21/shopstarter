const themePresets = {
  classic: {
    background: ["#ffffff", "#e8e8e8"],
    accent: "#111111",
    accentSoft: "#6b7280",
    label: "Classic",
    tagline: "Clean basics",
  },
  streetwear: {
    background: ["#0a0a0a", "#1f1f1f"],
    accent: "#f5f200",
    accentSoft: "#d4d400",
    label: "Streetwear",
    tagline: "Street sports",
  },
  harvest: {
    background: ["#fdf6ec", "#f0dfc8"],
    accent: "#c1572c",
    accentSoft: "#8c4c2b",
    label: "Harvest",
    tagline: "Wellness goods",
  },
}

const categoryVisuals = {
  Shoes: { icon: "👟", title: "Shoes" },
  Clothing: { icon: "👕", title: "Apparel" },
  Accessories: { icon: "🕶️", title: "Accessories" },
  Bags: { icon: "👜", title: "Bags" },
  default: { icon: "✨", title: "Featured" },
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function buildSvgDataUri(product, theme) {
  const preset = themePresets[theme] || themePresets.classic
  const category = categoryVisuals[product?.category?.trim()] || categoryVisuals.default
  const productName = escapeXml(product?.name || preset.label)
  const themeLabel = escapeXml(preset.label)
  const themeTagline = escapeXml(preset.tagline)
  const categoryLabel = escapeXml(category.title)
  const icon = category.icon
  const [backgroundStart, backgroundEnd] = preset.background

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${productName}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${backgroundStart}" />
          <stop offset="100%" stop-color="${backgroundEnd}" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${preset.accent}" stop-opacity="0.95" />
          <stop offset="100%" stop-color="${preset.accentSoft}" stop-opacity="0.85" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bg)" />
      <circle cx="650" cy="140" r="120" fill="url(#accent)" opacity="0.18" />
      <circle cx="150" cy="640" r="180" fill="url(#accent)" opacity="0.12" />
      <rect x="70" y="70" width="660" height="660" rx="42" fill="rgba(255,255,255,0.08)" stroke="${preset.accent}" stroke-opacity="0.2" stroke-width="3" />
      <text x="110" y="160" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="${preset.accent}">${themeLabel}</text>
      <text x="110" y="210" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${preset.accentSoft}">${themeTagline}</text>
      <text x="400" y="470" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="150">${icon}</text>
      <text x="400" y="580" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="46" font-weight="700" fill="${preset.accent}">${categoryLabel}</text>
      <text x="400" y="635" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="${preset.accentSoft}">${productName}</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export function getThemeProductImage(product, theme) {
  return buildSvgDataUri(product, theme)
}
