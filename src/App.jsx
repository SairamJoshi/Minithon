import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import StoryDetail from './pages/StoryDetail'
import Settings from './pages/Settings'

// Inoreader React Components
import ReaderPage from './pages/ReaderPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

import './index.css'

function AppContent() {
  const [weights, setWeights] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  const isReaderRoute = [
    '/reader',
    '/inoreader',
    '/landing',
    '/login',
    '/signup',
  ].some((r) => location.pathname.startsWith(r))

  const handleInoreaderNavigate = (target) => {
    if (target === 'ekai') {
      navigate('/')
    } else if (target === 'home' || target === 'landing') {
      navigate('/inoreader')
    } else if (target === 'login') {
      navigate('/login')
    } else if (target === 'signup') {
      navigate('/signup')
    } else if (target === 'reader') {
      navigate('/reader')
    } else {
      navigate(`/${target}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!isReaderRoute && <Header />}
      <main className="flex-1">
        <Routes>
          {/* EKAI Intelligence Agent Routes */}
          <Route path="/" element={<Dashboard onWeightsChange={setWeights} />} />
          <Route path="/story/:id" element={<StoryDetail />} />
          <Route path="/settings" element={<Settings />} />

          {/* Inoreader RSS Newsfeed Routes */}
          <Route path="/reader" element={<ReaderPage onNavigate={handleInoreaderNavigate} />} />
          <Route path="/inoreader" element={<LandingPage onNavigate={handleInoreaderNavigate} />} />
          <Route path="/landing" element={<LandingPage onNavigate={handleInoreaderNavigate} />} />
          <Route path="/login" element={<LoginPage onNavigate={handleInoreaderNavigate} />} />
          <Route path="/signup" element={<SignupPage onNavigate={handleInoreaderNavigate} />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
