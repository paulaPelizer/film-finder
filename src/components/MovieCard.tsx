import { Link } from 'react-router-dom'
import type { OMDbMovieSummary } from '@/types'
import { normalizePosterUrl, handleImgError } from '@/lib/img'

type Props = {
  movie: OMDbMovieSummary
  isFavorite?: boolean
  onToggleFavorite?: (m: OMDbMovieSummary) => void
}

export default function MovieCard({ movie, isFavorite, onToggleFavorite }: Props) {
  const poster = normalizePosterUrl(movie.Poster)

  return (
    <div className="card overflow-hidden">
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={poster}
          alt={`Poster de ${movie.Title}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={handleImgError}
        />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-base font-semibold leading-tight line-clamp-2">{movie.Title}</h3>
          <p className="text-sm text-neutral-400">{movie.Year}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/movie/${movie.imdbID}`} className="btn btn-outline">Detalhes</Link>
          {onToggleFavorite && (
            <button
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onToggleFavorite(movie)}
            >
              {isFavorite ? 'Remover' : 'Favoritar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
