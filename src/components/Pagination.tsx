import { useMemo } from 'react'

interface Props {
  page: number
  totalPages: number
  onPageChange: (p: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  const canPrev = page > 1
  const canNext = page < totalPages

  const pages = useMemo(() => {
    const delta = 2
    const range: number[] = []
    const start = Math.max(1, page - delta)
    const end = Math.min(totalPages, page + delta)
    for (let i = start; i <= end; i++) range.push(i)
    return range
  }, [page, totalPages])

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button className="btn btn-outline" disabled={!canPrev} onClick={() => onPageChange(1)} aria-label="Primeira página">«</button>
      <button className="btn btn-outline" disabled={!canPrev} onClick={() => onPageChange(page - 1)} aria-label="Anterior">‹</button>
      {pages.map((p) => (
        <button key={p} className={`btn ${p === page ? 'btn-primary' : 'btn-outline'}`} onClick={() => onPageChange(p)} aria-current={p === page}
        >{p}</button>
      ))}
      <button className="btn btn-outline" disabled={!canNext} onClick={() => onPageChange(page + 1)} aria-label="Próxima">›</button>
      <button className="btn btn-outline" disabled={!canNext} onClick={() => onPageChange(totalPages)} aria-label="Última página">»</button>
    </div>
  )
}