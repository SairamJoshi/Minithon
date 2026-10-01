import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function WeightShiftToast({ oldWeights, newWeights, onClose }) {
  if (!oldWeights || !newWeights) return null

  const LABELS = {
    relevance: 'Relevance',
    novelty: 'Novelty',
    credibility: 'Credibility',
    urgency: 'Urgency',
    velocity: 'Velocity',
    independence: 'Independence',
  }

  const changes = Object.keys(LABELS).map(key => ({
    key,
    label: LABELS[key],
    old: Math.round((oldWeights[key] || 0) * 100),
    new: Math.round((newWeights[key] || 0) * 100),
    diff: Math.round((newWeights[key] || 0) * 100) - Math.round((oldWeights[key] || 0) * 100),
  })).filter(c => c.diff !== 0)

  if (changes.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 glass-card p-4 w-72 shadow-2xl shadow-accent-glow"
      id="weight-shift-toast"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold glow-text">Personalization Updated</h4>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary text-lg leading-none"
        >
          ×
        </button>
      </div>
      <div className="space-y-1.5">
        {changes.map(c => (
          <div key={c.key} className="flex items-center justify-between text-xs">
            <span className="text-text-secondary">{c.label}</span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-text-muted">{c.old}%</span>
              <ArrowRight className="w-3 h-3 text-text-muted" />
              <span className={c.diff > 0 ? 'text-green-400' : 'text-red-400'}>
                {c.new}%
              </span>
              <span className={`text-[10px] ${c.diff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                ({c.diff > 0 ? '+' : ''}{c.diff})
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
