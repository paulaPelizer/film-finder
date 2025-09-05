import { useLocalStorage } from '@/lib/useLocalStorage'
import type { OMDbMovieSummary } from '@/types'
import MovieCard from '@/components/MovieCard'

export default function Favorites() {
  const [favorites, setFavorites] = useLocalStorage<OMDbMovieSummary[]>('favorites', [])

  function toggle(movie: OMDbMovieSummary) {
    setFavorites((curr) => curr.some((m) => m.imdbID === movie.imdbID)
      ? curr.filter((m) => m.imdbID !== movie.imdbID)
      : [...curr, movie]
    )
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Favoritos</h1>
        {favorites.length > 0 && (
          <button className="btn btn-outline" onClick={() => setFavorites([])}>Limpar tudo</button>
        )}
      </header>

      {favorites.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-neutral-300">Nenhum favorito ainda. Adicione filmes pela página de busca ou detalhes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {favorites.map((m) => (
            <MovieCard key={m.imdbID} movie={m} isFavorite onToggleFavorite={toggle} />
          ))}
        </div>
      )}
    </section>
  )
}