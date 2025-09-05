import { Route, Routes, Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Search from '@/pages/Search'
import Details from '@/pages/Details'
import Favorites from '@/pages/Favorites'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-6">
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/movie/:id" element={<Details />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}