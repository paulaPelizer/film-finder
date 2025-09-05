import { Link, NavLink, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [params] = useSearchParams()
  const [shadow, setShadow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShadow(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const q = params.get('q') ?? ''

  return (
    <header
      className={`sticky top-0 z-40 bg-neutral-950/80 backdrop-blur border-b border-neutral-800 ${
        shadow ? 'shadow-soft' : ''
      }`}
    >
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-500 text-black font-bold">
            FF
          </span>
          <span>Film Finder</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <NavLink
            to={{ pathname: '/', search: q ? `?q=${encodeURIComponent(q)}` : '' }}
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`
            }
          >
            Buscar
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl ${isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`
            }
          >
            Favoritos
          </NavLink>
          <a
            href="https://www.omdbapi.com/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl hover:bg-neutral-900"
          >
            OMDb
          </a>
        </nav>
      </div>
    </header>
  )
}
