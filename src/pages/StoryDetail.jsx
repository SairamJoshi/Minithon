import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Clock, ExternalLink, ThumbsUp, ThumbsDown,
  Shield, GitBranch, CheckCircle2, AlertTriangle, Circle,
  Users, Hash, Calendar, Newspaper, ChevronDown, ChevronUp
} from 'lucide-react'
import ScoreBar from '../components/ScoreBar'
import WeightShiftToast from '../components/WeightShiftToast'
import { fetchStoryDetail, submitFeedback } from '../services/api'

const CLAIM_CONFIG = {
  agreed: { icon: CheckCircle2, label: 'AGREED', color: 'text-claim-agreed', bg: 'bg-claim-agreed/10 border-claim-agreed/20' },
  disputed: { icon: AlertTriangle, label: 'DISPUTED', color: 'text-claim-disputed', bg: 'bg-claim-disputed/10 border-claim-disputed/20' },
  single: { icon: Circle, label: 'SINGLE SOURCE', color: 'text-claim-single', bg: 'bg-claim-single/10 border-claim-single/20' },
}

export default function StoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [feedbackState, setFeedbackState] = useState(null)
  const [weightShift, setWeightShift] = useState(null)
  const [showAllSources, setShowAllSources] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchStoryDetail(id)
      .then(data => setStory(data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  async function handleFeedback(type) {
    if (feedbackState) return
    const result = await submitFeedback(id, type)
    setFeedbackState(type)
    if (result?.old_weights && result?.new_weights) {
      setWeightShift(result)
      setTimeout(() => setWeightShift(null), 6000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="glass-card p-8 space-y-4">
          <div className="w-1/3 h-6 shimmer rounded" />
          <div className="w-full h-8 shimmer rounded" />
          <div className="w-2/3 h-4 shimmer rounded" />
          <div className="w-full h-24 shimmer rounded" />
        </div>
      </div>
    )
  }

  if (!story) return null

  const independentSources = story.sources?.filter(s => s.independent) || []
  const derivedSources = story.sources?.filter(s => !s.independent) || []
  const totalSources = story.sources?.length || 0

  const claimCounts = {
    agreed: story.claims?.filter(c => c.status === 'agreed').length || 0,
    disputed: story.claims?.filter(c => c.status === 'disputed').length || 0,
    single: story.claims?.filter(c => c.status === 'single').length || 0,
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-secondary hover:text-accent-primary mb-6 transition-colors"
        id="back-button"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Back to Briefing</span>
      </motion.button>

      {/* Main Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header Card */}
        <div className="glass-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full border ${
              story.tier === 'urgent' ? 'bg-red-500/15 text-red-400 border-red-500/30' :
              story.tier === 'important' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
              'bg-blue-500/15 text-blue-400 border-blue-500/30'
            }`}>
              {story.tier?.toUpperCase()}
            </span>
            <div className="flex items-center gap-1.5 text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              <span className="text-xs">{story.read_min} min read</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight mb-4">
            {story.title}
          </h1>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-6">
            {story.summary}
          </p>

          {/* Feedback Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-border-subtle">
            <span className="text-xs text-text-muted">Was this useful?</span>
            <button
              onClick={() => handleFeedback('up')}
              disabled={feedbackState !== null}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                feedbackState === 'up'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : feedbackState
                    ? 'opacity-30 cursor-not-allowed text-text-muted border border-border-subtle'
                    : 'text-text-secondary border border-border-subtle hover:text-green-400 hover:border-green-500/30 hover:bg-green-500/5'
              }`}
              id="detail-feedback-up"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Relevant
            </button>
            <button
              onClick={() => handleFeedback('down')}
              disabled={feedbackState !== null}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                feedbackState === 'down'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : feedbackState
                    ? 'opacity-30 cursor-not-allowed text-text-muted border border-border-subtle'
                    : 'text-text-secondary border border-border-subtle hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5'
              }`}
              id="detail-feedback-down"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              Not useful
            </button>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Why It Matters */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-accent-primary mb-3 flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Why It Matters
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                {story.why_it_matters}
              </p>
            </div>

            {/* Source Independence */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-score-independence mb-4 flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                Source Independence
              </h2>

              {/* Independence Summary */}
              <div className="flex items-center gap-4 mb-5 p-3 rounded-xl bg-bg-glass border border-border-subtle">
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">{totalSources}</p>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Sources</p>
                </div>
                <div className="text-text-muted">→</div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-score-independence">{independentSources.length}</p>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Independent</p>
                </div>
                <div className="text-text-muted">→</div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-text-primary">{Math.round(story.independence * 100)}%</p>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Independence</p>
                </div>
              </div>

              {/* Source Tree */}
              <div className="space-y-2">
                {/* Independent sources */}
                {independentSources.map((source, i) => (
                  <motion.div
                    key={source.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-score-independence/5 border border-score-independence/15">
                      <Shield className="w-4 h-4 text-score-independence flex-shrink-0" />
                      <span className="text-sm font-medium text-text-primary">{source.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-score-independence/15 text-score-independence font-medium">
                        INDEPENDENT
                      </span>
                    </div>
                    {/* Derived sources below this independent source */}
                    {derivedSources
                      .filter(d => d.derived_from === source.name)
                      .map((derived, j) => (
                        <motion.div
                          key={derived.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (i + j + 1) * 0.1 }}
                          className="ml-8 mt-1 flex items-center gap-3 p-2 rounded-lg bg-bg-glass border border-border-subtle"
                        >
                          <div className="w-4 h-[1px] bg-text-muted" />
                          <span className="text-sm text-text-secondary">{derived.name}</span>
                          <span className="text-[10px] text-text-muted">↳ derived from {derived.derived_from}</span>
                        </motion.div>
                      ))
                    }
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Claims */}
            <div className="glass-card p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-claim-agreed mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Claim Analysis
              </h2>

              {/* Claim counts summary */}
              <div className="flex gap-3 mb-5">
                {Object.entries(claimCounts).map(([type, count]) => {
                  const config = CLAIM_CONFIG[type]
                  return (
                    <div key={type} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${config.bg}`}>
                      <config.icon className={`w-3.5 h-3.5 ${config.color}`} />
                      <span className={`text-xs font-medium ${config.color}`}>{count} {config.label}</span>
                    </div>
                  )
                })}
              </div>

              {/* Individual claims */}
              <div className="space-y-3">
                {story.claims?.map((claim, i) => {
                  const config = CLAIM_CONFIG[claim.status]
                  const Icon = config.icon
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className={`p-4 rounded-xl border ${config.bg}`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.color}`} />
                        <div className="flex-1">
                          <p className="text-sm text-text-primary mb-2">{claim.text}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {claim.sources?.map(s => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-glass border border-border-subtle text-text-secondary">
                                {s}
                              </span>
                            ))}
                            {claim.counter_sources?.map(s => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-claim-disputed/10 border border-claim-disputed/20 text-claim-disputed">
                                ⚡ {s} disagrees
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Timeline */}
            {story.timeline && story.timeline.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-accent-secondary mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Story Timeline
                </h2>
                <div className="relative pl-6">
                  {/* Timeline line */}
                  <div className="absolute left-2 top-2 bottom-2 w-px bg-border-subtle" />
                  <div className="space-y-4">
                    {story.timeline.map((event, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative"
                      >
                        {/* Timeline dot */}
                        <div className="absolute -left-[18px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent-secondary border-2 border-bg-primary" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono text-accent-secondary">{event.time}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-bg-glass border border-border-subtle text-text-muted">
                              {event.source}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary">{event.event}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-6">
            {/* Scoring Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4">
                AI Score Breakdown
              </h3>
              <ScoreBar scores={story.components} />
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">Final Score</span>
                  <span className="text-lg font-bold glow-text font-mono">
                    {Math.round(story.final_score * 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* Entities */}
            {story.entities && story.entities.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Key Entities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {story.entities.map(entity => (
                    <span key={entity} className="text-xs px-3 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-accent-primary font-medium">
                      {entity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Numbers */}
            {story.key_numbers && story.key_numbers.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                  <Hash className="w-4 h-4" />
                  Key Numbers
                </h3>
                <div className="space-y-2">
                  {story.key_numbers.map((num, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-score-velocity" />
                      <span className="text-text-secondary">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sources List */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                All Sources ({totalSources})
              </h3>
              <div className="space-y-1.5">
                {story.sources?.map((source, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-bg-hover transition-colors">
                    <div className="flex items-center gap-2">
                      {source.independent ? (
                        <Shield className="w-3.5 h-3.5 text-score-independence" />
                      ) : (
                        <div className="w-3.5 h-3.5 flex items-center justify-center text-text-muted text-[8px]">↳</div>
                      )}
                      <span className="text-sm text-text-secondary">{source.name}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.article>

      {/* Weight Shift Toast */}
      <AnimatePresence>
        {weightShift && (
          <WeightShiftToast
            oldWeights={weightShift.old_weights}
            newWeights={weightShift.new_weights}
            onClose={() => setWeightShift(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
