const FALLBACK = '/placeholder-poster.svg'

export function normalizePosterUrl(url?: string) {
  if (!url || url === 'N/A') return FALLBACK
  // Se vier sem protocolo ("//m.media-amazon.com/..."), prefixa https:
  if (url.startsWith('//')) return 'https:' + url
  return url
}

export function handleImgError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget
  // evita loop infinito de erro
  img.onerror = null
  img.src = FALLBACK
}
