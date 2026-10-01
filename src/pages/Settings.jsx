import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Sliders, Info } from 'lucide-react'
import { getWeights, resetWeights } from '../services/api'

const WEIGHT_LABELS = {
  relevance: { label: 'Relevance', desc: 'How closely a story matches your interests and goal', color: '#7c5cfc' },
  novelty: { label: 'Novelty', desc: 'How new and unique the information is', color: '#5cf0a8' },
  credibility: { label: 'Credibility', desc: 'Source trustworthiness and reporting quality', color: '#5cacfc' },
  urgency: { label: 'Urgency', desc: 'Time-sensitivity and breaking news priority', color: '#fc5c7c' },
  velocity: { label: 'Velocity', desc: 'How fast a story is gaining coverage', color: '#fcac5c' },
  independence: { label: 'Independence', desc: 'How many sources reported independently', color: '#c45cfc' },
}

export default function Settings() {
  const [weights, setWeights] = useState(getWeights())
  const [resetFlash, setResetFlash] = useState(false)

  const handleReset = () => {
    const newWeights = resetWeights()
    setWeights(newWeights)
    setResetFlash(true)
    setTimeout(() => setResetFlash(false), 1500)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
              <Sliders className="w-6 h-6 text-accent-primary" />
              Settings
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Configure how Ekai prioritizes your briefings
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-subtle text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 transition-all text-sm"
            id="reset-weights"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Reset Flash */}
        {resetFlash && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center"
          >
            ✓ Weights reset to defaults
          </motion.div>
        )}

        {/* Current Weights */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-5">
            Scoring Weights
          </h3>
          <p className="text-xs text-text-muted mb-6 flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            These weights determine how stories are ranked in your briefing. They adapt automatically when you give feedback (👍/👎) on stories.
          </p>

          <div className="space-y-5">
            {Object.entries(WEIGHT_LABELS).map(([key, config], i) => {
              const value = weights[key] || 0
              const pct = Math.round(value * 100)
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
                        <span className="text-sm font-medium text-text-primary">{config.label}</span>
                      </div>
                      <p className="text-[11px] text-text-muted ml-[18px] mt-0.5">{config.desc}</p>
                    </div>
                    <span className="text-sm font-bold font-mono text-text-primary">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-glass border border-border-subtle overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: config.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct * 2}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Info Card */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">
            How Personalization Works
          </h3>
          <div className="space-y-3 text-sm text-text-secondary">
            <div className="flex gap-3">
              <span className="text-accent-primary font-bold">1.</span>
              <p>When you 👍 a story, Ekai boosts the weights of that story's strongest scoring components.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-accent-primary font-bold">2.</span>
              <p>When you 👎 a story, those weights decrease and weaker components get a boost.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-accent-primary font-bold">3.</span>
              <p>Over time, your briefings become increasingly personalized to your preferences.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-accent-primary font-bold">4.</span>
              <p>You can always reset to defaults using the button above.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
