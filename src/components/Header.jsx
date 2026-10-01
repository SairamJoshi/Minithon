import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Settings, BarChart3, Newspaper } from 'lucide-react'

export default function Header() {
  const location = useLocation()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 glass border-b border-border-subtle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg shadow-accent-glow">
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-text-primary">
                EKAI
              </h1>
              <p className="text-[10px] font-medium tracking-[0.2em] uppercase text-text-muted -mt-0.5">
                Intelligence Agent
              </p>
            </div>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 rounded-full bg-green-400 pulse-live" />
              <span className="text-xs font-medium text-green-400">LIVE</span>
            </div>

            {/* Nav links */}
            <nav className="flex items-center gap-1">
              <Link
                to="/"
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
                title="EKAI Dashboard"
              >
                <BarChart3 className="w-5 h-5" />
              </Link>
              <Link
                to="/reader"
                className={`p-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 px-3 ${
                  location.pathname.startsWith('/reader') || location.pathname === '/inoreader'
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
                title="Newsfeed Reader"
              >
                <Newspaper className="w-5 h-5" />
                <span className="text-xs font-semibold hidden md:inline">Reader</span>
              </Link>
              <Link
                to="/settings"
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  location.pathname === '/settings'
                    ? 'bg-accent-primary/15 text-accent-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
