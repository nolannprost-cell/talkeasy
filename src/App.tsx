import { Navigate, Route, Routes } from 'react-router-dom'
import { useProfile } from './hooks/useProfile'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import ThreeMinutes from './pages/ThreeMinutes'
import Focus from './pages/Focus'
import Bases from './pages/Bases'
import ProfilePage from './pages/Profile'

export default function App() {
  const { profile, loading, setup, update } = useProfile()

  if (loading) return null

  if (!profile) {
    return <Onboarding onComplete={setup} />
  }

  return (
    <>
      {/* Filigrane discret mais lisible, présent en fond sur toutes les pages. */}
      <p
        className="fixed inset-x-0 bottom-6 z-0 text-center font-display italic text-sm text-blush-deep/40 select-none px-6"
        aria-hidden
      >
        Esaïe 41:10. · Proverbes 31:25
      </p>
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home profile={profile} />} />
          <Route path="/three-minutes" element={<ThreeMinutes />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/bases" element={<Bases />} />
          <Route path="/profile" element={<ProfilePage profile={profile} onUpdate={update} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}
