import { motion } from 'framer-motion'

const SCORE_COLORS = {
  relevance: '#7c5cfc',
  novelty: '#5cf0a8',
  credibility: '#5cacfc',
  urgency: '#fc5c7c',
  velocity: '#fcac5c',
  independence: '#c45cfc',
}

const SCORE_LABELS = {
  relevance: 'Relevance',
  novelty: 'Novelty',
  credibility: 'Credibility',
  urgency: 'Urgency',
  velocity: 'Velocity',
  independence: 'Independence',
}

export default function ScoreBar({ scores, compact = false }) {
  if (!scores) return null

  const entries = Object.entries(scores).filter(([key]) => SCORE_COLORS[key])

  if (compact) {
    // Show only top 3 scores in compact mode
    const top3 = entries.sort((a, b) => b[1] - a[1]).slice(0, 3)
    return (
      <div className="flex gap-3">
        {top3.map(([key, value]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: SCORE_COLORS[key] }}
            />
            <span className="text-[11px] text-text-secondary">{SCORE_LABELS[key]}</span>
            <span className="text-[11px] font-semibold text-text-primary">
              {Math.round(value * 100)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      {entries.map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.08 }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: SCORE_COLORS[key] }}
              />
              <span className="text-xs font-medium text-text-secondary">
                {SCORE_LABELS[key]}
              </span>
            </div>
            <span className="text-xs font-bold text-text-primary font-mono">
              {Math.round(value * 100)}
            </span>
          </div>
          <div className="score-bar">
            <motion.div
              className="score-bar-fill"
              style={{ backgroundColor: SCORE_COLORS[key] }}
              initial={{ width: 0 }}
              animate={{ width: `${value * 100}%` }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
