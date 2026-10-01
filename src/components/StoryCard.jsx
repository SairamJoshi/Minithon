import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ExternalLink, ThumbsUp, ThumbsDown, ChevronRight, Newspaper, Shield, GitBranch } from 'lucide-react'
import ScoreBar from './ScoreBar'
import { submitFeedback } from '../services/api'

const TIER_CONFIG = {
  urgent: { label: 'URGENT', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  important: { label: 'IMPORTANT', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  info: { label: 'INFO', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  low: { label: 'LOW', color: 'bg-gray-500/15 text-gray-400 border-gray-500/30' },
}

export default function StoryCard({ story, index, onFeedback }) {
  const navigate = useNavigate()
  const [feedbackState, setFeedbackState] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tier = TIER_CONFIG[story.tier] || TIER_CONFIG.info
  const independentCount = story.sources?.filter(s => s.independent).length || 0
  const totalSources = story.sources?.length || 0
  const timeAgo = getTimeAgo(story.published_at)

  async function handleFeedback(type) {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const result = await submitFeedback(story.id, type)
      setFeedbackState(type)
      if (onFeedback) onFeedback(result)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card p-5 sm:p-6 cursor-pointer group"
      onClick={() => navigate(`/story/${story.id}`)}
      role="article"
      id={`story-card-${story.id}`}
    >
      {/* Top row: tier badge + time */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border ${tier.color}`}>
            {tier.label}
          </span>
          <span className="text-xs text-text-muted">{timeAgo}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{story.read_min} min</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2 leading-snug group-hover:text-accent-primary transition-colors duration-200">
        {story.title}
      </h3>

      {/* Sources row */}
      <div className="flex items-center gap-2 mb-3">
        <Newspaper className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
        <div className="flex flex-wrap gap-1">
          {story.sources?.slice(0, 5).map((source, i) => (
            <span key={i} className="text-[11px] text-text-secondary px-1.5 py-0.5 rounded bg-bg-glass">
              {source.name}
            </span>
          ))}
          {totalSources > 5 && (
            <span className="text-[11px] text-text-muted">+{totalSources - 5} more</span>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
        {story.summary}
      </p>

      {/* Score bars (compact) */}
      <div className="mb-4">
        <ScoreBar scores={story.components} compact />
      </div>

      {/* Independence + Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
        {/* Independence */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-score-independence" />
            <span className="text-xs text-text-secondary">
              {totalSources} sources → {independentCount} independent
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-score-credibility" />
            <span className="text-xs font-semibold text-text-primary">
              {Math.round(story.independence * 100)}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => handleFeedback('up')}
            disabled={feedbackState !== null}
            className={`p-2 rounded-lg transition-all duration-200 ${
              feedbackState === 'up'
                ? 'bg-green-500/20 text-green-400'
                : feedbackState !== null
                  ? 'opacity-30 cursor-not-allowed text-text-muted'
                  : 'text-text-muted hover:text-green-400 hover:bg-green-500/10'
            }`}
            id={`feedback-up-${story.id}`}
          >
            <ThumbsUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleFeedback('down')}
            disabled={feedbackState !== null}
            className={`p-2 rounded-lg transition-all duration-200 ${
              feedbackState === 'down'
                ? 'bg-red-500/20 text-red-400'
                : feedbackState !== null
                  ? 'opacity-30 cursor-not-allowed text-text-muted'
                  : 'text-text-muted hover:text-red-400 hover:bg-red-500/10'
            }`}
            id={`feedback-down-${story.id}`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-lg text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all duration-200"
            onClick={(e) => { e.stopPropagation(); navigate(`/story/${story.id}`) }}
            id={`detail-${story.id}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feedback toast */}
      {feedbackState && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-3 py-2 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-xs text-accent-primary text-center"
        >
          ✨ Personalization updated
        </motion.div>
      )}
    </motion.article>
  )
}

function getTimeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}
