import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import StoryDetail from './pages/StoryDetail'
import Settings from './pages/Settings'
import './index.css'

export default function App() {
  const [weights, setWeights] = useState(null)

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard onWeightsChange={setWeights} />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
