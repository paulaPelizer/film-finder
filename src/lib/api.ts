import type { OMDbMovieFull, OMDbSearchResult } from '@/types'

// pega direto do .env
const API_KEY = import.meta.env.VITE_OMDB_API_KEY
// em dev, usamos o proxy configurado no vite.config ("/omdb/")
const BASE = '/omdb/'

function url(params: Record<string, string | number>) {
  if (!API_KEY) {
    throw new Error('Chave OMDb ausente. Defina VITE_OMDB_API_KEY no .env')
  }
  const usp = new URLSearchParams({ ...params, apikey: API_KEY })
  return `${BASE}?${usp.toString()}`
}

export async function searchMovies(query: string, page = 1): Promise<OMDbSearchResult> {
  if (!query.trim()) {
    return { Response: 'False', Error: 'Digite um termo para buscar.' }
  }

  const res = await fetch(url({ s: query.trim(), page }))
  const data = await res.json()

  if (!res.ok || data?.Response === 'False') {
    throw new Error(data?.Error || `Erro HTTP ${res.status}`)
  }
  return data
}

export async function getMovieById(imdbID: string): Promise<OMDbMovieFull> {
  const res = await fetch(url({ i: imdbID, plot: 'full' }))
  const data = await res.json()

  if (!res.ok || data?.Response === 'False') {
    throw new Error(data?.Error || `Erro HTTP ${res.status}`)
  }
  return data
}

export async function searchOneByTitle(query: string) {
  if (!query.trim()) {
    return { Response: 'False', Error: 'Digite um termo para buscar.' }
  }

  const res = await fetch(url({ t: query.trim(), plot: 'short' }))
  const data = await res.json()

  if (!res.ok || data?.Response === 'False') {
    throw new Error(data?.Error || `Erro HTTP ${res.status}`)
  }

  // normaliza para o formato de lista
  const one = {
    imdbID: data.imdbID,
    Title: data.Title,
    Year: data.Year,
    Type: data.Type,
    Poster: data.Poster,
  }
  return { Search: [one], totalResults: '1', Response: 'True' } as const
}
