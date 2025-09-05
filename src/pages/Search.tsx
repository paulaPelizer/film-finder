import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { OMDbMovieSummary } from '@/types'
import MovieCard from '@/components/MovieCard'
import Pagination from '@/components/Pagination'
import { useLocalStorage } from '@/lib/useLocalStorage'
import { searchMovies } from '@/lib/api' // volta a usar s= com paginação

export default function Search() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const [queryInput, setQueryInput] = useState(params.get('q') ?? '')
  const [page, setPage] = useState(() => Number(params.get('page') ?? 1))

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<OMDbMovieSummary[]>([])
  const [total, setTotal] = useState(0)

  const [favorites, setFavorites] = useLocalStorage<OMDbMovieSummary[]>('favorites', [])

  // totalResults da OMDb já é múltiplo de 10; manteremos para a paginação
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / 10)), [total])

  function submit(e?: FormEvent) {
    e?.preventDefault()
    setPage(1)
    setParams((p) => {
      const np = new URLSearchParams(p)
      if (queryInput.trim()) np.set('q', queryInput.trim())
      else np.delete('q')
      np.set('page', '1')
      return np
    })
  }

  useEffect(() => {
    const q = params.get('q')
    const pg = Number(params.get('page') ?? 1)
    setPage(pg)

    async function run() {
      if (!q) {
        setResults([])
        setTotal(0)
        setError(null)
        return
      }
      setLoading(true)
      setError(null)
      try {
        // busca paginada (10 por página por padrão da OMDb)
        const data = await searchMovies(q, pg)

        if (data.Response === 'False') {
          setResults([])
          setTotal(0)
          setError(data.Error || 'Nenhum resultado encontrado.')
        } else {
          // filtro extra: garantir que o título contém o termo buscado (case-insensitive)
          const term = q.trim().toLowerCase()
          const list = (data.Search || []).filter(
            (m) => m.Title?.toLowerCase().includes(term)
          )

          // limitar visualização a 10 itens (defensivo; a OMDb já manda no máx. 10)
          const visible = list.slice(0, 10)

          setResults(visible)
          // manter contagem total para paginação (preferimos a da OMDb; se faltar, usa visible.length)
          setTotal(Number(data.totalResults || visible.length))
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar filmes.')
        setResults([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [params])

  function toggleFavorite(movie: OMDbMovieSummary) {
    setFavorites((curr) => {
      const exists = curr.some((m) => m.imdbID === movie.imdbID)
      return exists ? curr.filter((m) => m.imdbID !== movie.imdbID) : [...curr, movie]
    })
  }

  const isFav = (id: string) => favorites.some((m) => m.imdbID === id)

  return (
    <section className="space-y-6">
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
        <input
          className="input"
          placeholder="Busque por título, ex.: Matrix"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">Buscar</button>
          <button className="btn btn-outline" type="button" onClick={() => { setQueryInput(''); navigate('/') }}>Limpar</button>
        </div>
      </form>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="skeleton h-48 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-8 w-full" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card p-4 border-red-900 bg-red-900/20 text-red-200">
          <p className="font-semibold">{error}</p>
          <p className="text-sm opacity-80">Tente ajustar o termo de busca.</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <>
          <p className="text-sm text-neutral-400">
            Exibindo {results.length} de {total} resultados
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {results.map((m) => (
              <MovieCard
                key={m.imdbID}
                movie={m}
                isFavorite={isFav(m.imdbID)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          {/* paginação mantém 10/pg; só aparece se houver mais de 1 página */}
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) =>
                setParams((prev) => {
                  const np = new URLSearchParams(prev)
                  np.set('page', String(p))
                  return np
                })
              }
            />
          )}
        </>
      )}

      {!loading && !error && results.length === 0 && params.get('q') && (
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Nada encontrado</h2>
          <p className="text-neutral-400">Tente outro termo, ex.: “The Matrix”.</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && !params.get('q') && (
        <div className="card p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Comece uma busca</h2>
          <p className="text-neutral-400">Digite um título no campo acima para explorar o catálogo.</p>
        </div>
      )}
    </section>
  )
}
