import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getMovieById } from '@/lib/api'
import type { OMDbMovieFull, OMDbMovieSummary } from '@/types'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { normalizePosterUrl, handleImgError } from '@/lib/img'

export default function Details() {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<OMDbMovieFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useLocalStorage<OMDbMovieSummary[]>('favorites', [])

  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await getMovieById(id!)
        if ((data as any).Response === 'False') {
          setError((data as any).Error || 'Filme não encontrado.')
          setMovie(null)
        } else if (!ignore) {
          setMovie(data)
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar detalhes.')
        setMovie(null)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    if (id) run()
    return () => { ignore = true }
  }, [id])

  const isFav = !!movie && favorites.some((m) => m.imdbID === movie.imdbID)
  function toggleFavorite() {
    if (!movie) return
    const mini: OMDbMovieSummary = {
      imdbID: movie.imdbID,
      Poster: movie.Poster,
      Title: movie.Title,
      Year: movie.Year,
      Type: movie.Type
    }
    setFavorites((curr) => {
      const exists = curr.some((m) => m.imdbID === movie.imdbID)
      return exists ? curr.filter((m) => m.imdbID !== movie.imdbID) : [...curr, mini]
    })
  }

  if (loading) {
    return (
      <div className="card p-6 space-y-4">
        <div className="skeleton h-8 w-56" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="skeleton h-96 w-full" />
          <div className="md:col-span-2 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="card p-6 border-red-900 bg-red-900/20 text-red-200">{error}</div>
  }

  if (!movie) return null

  const poster = normalizePosterUrl(movie.Poster)

  return (
    <article className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {movie.Title} <span className="text-neutral-400 font-normal">({movie.Year})</span>
        </h1>
        <button className={`btn ${isFav ? 'btn-primary' : 'btn-outline'}`} onClick={toggleFavorite}>
          {isFav ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        </button>
      </header>

      <div className="card p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <img
            src={poster}
            alt={`Poster de ${movie.Title}`}
            className="w-full rounded-2xl object-cover"
            onError={handleImgError}
          />
        </div>
        <div className="md:col-span-2 space-y-3">
          <p><span className="text-neutral-400">Diretor:</span> {movie.Director || '—'}</p>
          <p><span className="text-neutral-400">Elenco:</span> {movie.Actors || '—'}</p>
          <p><span className="text-neutral-400">Gênero:</span> {movie.Genre || '—'}</p>
          <p><span className="text-neutral-400">Duração:</span> {movie.Runtime || '—'}</p>
          <p><span className="text-neutral-400">País:</span> {movie.Country || '—'}</p>
          <p><span className="text-neutral-400">Idioma:</span> {movie.Language || '—'}</p>
          <p><span className="text-neutral-400">Avaliação IMDb:</span> {movie.imdbRating || '—'} ({movie.imdbVotes || '0'} votos)</p>
          <div>
            <h2 className="font-semibold mb-1">Sinopse</h2>
            <p className="text-neutral-300 leading-relaxed">{movie.Plot || '—'}</p>
          </div>
          {movie.Ratings && movie.Ratings.length > 0 && (
            <div>
              <h3 className="font-semibold mb-1">Ratings</h3>
              <ul className="list-disc list-inside text-neutral-300">
                {movie.Ratings.map((r) => (
                  <li key={r.Source}><span className="text-neutral-400">{r.Source}:</span> {r.Value}</li>
                ))}
              </ul>
            </div>
          )}
          {movie.Website && movie.Website !== 'N/A' && (
            <p><a className="underline" href={movie.Website} target="_blank" rel="noreferrer">Site oficial</a></p>
          )}
        </div>
      </div>
    </article>
  )
}
