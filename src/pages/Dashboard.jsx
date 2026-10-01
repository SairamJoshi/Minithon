import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, Sparkles, TrendingUp, Layers, Timer, Brain } from 'lucide-react'
import StoryCard from '../components/StoryCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import WeightShiftToast from '../components/WeightShiftToast'
import { fetchBriefing } from '../services/api'

const QUICK_TOPICS = [
  { label: 'UPI', query: 'UPI regulation' },
  { label: 'Fintech', query: 'Indian fintech funding' },
  { label: 'RBI', query: 'RBI policy' },
  { label: 'Startups', query: 'Indian startup funding' },
  { label: 'AI & Tech', query: 'AI technology India' },
  { label: 'Crypto', query: 'cryptocurrency regulation India' },
]

const TIME_OPTIONS = [5, 10, 15, 30]

export default function Dashboard() {
  const [goal, setGoal] = useState('')
  const [minutes, setMinutes] = useState(10)
  const [briefing, setBriefing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [weightShift, setWeightShift] = useState(null)

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault()
    if (!goal.trim()) return

    setLoading(true)
    setError(null)
    setBriefing(null)

    try {
      const data = await fetchBriefing(goal, minutes)
      setBriefing(data)
    } catch (err) {
      setError('Failed to generate briefing. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [goal, minutes])

  const handleQuickTopic = (query) => {
    setGoal(query)
    setLoading(true)
    setError(null)
    setBriefing(null)
    fetchBriefing(query, minutes)
      .then(data => setBriefing(data))
      .catch(() => setError('Failed to generate briefing.'))
      .finally(() => setLoading(false))
  }

  const handleFeedback = (result) => {
    if (result?.old_weights && result?.new_weights) {
      setWeightShift(result)
      setTimeout(() => setWeightShift(null), 5000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="glow-text">Cut through the noise.</span>
        </h2>
        <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto">
          Tell Ekai what you want to understand. Get an AI-powered briefing in the time you have.
        </p>
      </motion.section>

      {/* Goal Input */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Brain className="w-5 h-5 text-accent-primary" />
            </div>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What do you want to understand? (e.g., Indian fintech + UPI regulations)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-bg-card border border-border-subtle text-text-primary placeholder-text-muted text-sm sm:text-base focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-glow transition-all duration-300"
              id="goal-input"
            />
          </div>

          {/* Quick Topics */}
          <div className="flex flex-wrap gap-2">
            {QUICK_TOPICS.map((topic) => (
              <button
                key={topic.label}
                type="button"
                onClick={() => handleQuickTopic(topic.query)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-bg-glass border border-border-subtle text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 hover:bg-accent-primary/5 transition-all duration-200"
              >
                {topic.label}
              </button>
            ))}
          </div>

          {/* Time Selector + Submit */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Time options */}
            <div className="flex items-center gap-2 flex-1">
              <Timer className="w-4 h-4 text-text-muted flex-shrink-0" />
              <span className="text-xs text-text-muted whitespace-nowrap">How much time?</span>
              <div className="flex gap-1.5">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMinutes(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      minutes === t
                        ? 'bg-accent-primary text-white shadow-lg shadow-accent-glow'
                        : 'bg-bg-glass border border-border-subtle text-text-secondary hover:border-accent-primary/30'
                    }`}
                    id={`time-${t}`}
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={!goal.trim() || loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-accent-primary to-accent-secondary text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent-glow disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl hover:shadow-accent-glow"
              id="generate-briefing"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Analyzing...' : 'Generate Briefing'}
            </motion.button>
          </div>
        </form>
      </motion.section>

      {/* Briefing Meta */}
      <AnimatePresence mode="wait">
        {briefing && (
          <motion.section
            key="meta"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <div className="glass-card p-4 flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-primary/15 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-accent-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Analyzed</p>
                  <p className="text-sm font-bold text-text-primary">
                    {briefing.meta.total_articles_analyzed} articles
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-score-novelty/15 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-score-novelty" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Clusters</p>
                  <p className="text-sm font-bold text-text-primary">
                    {briefing.meta.story_clusters} stories
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-secondary/15 flex items-center justify-center">
                  <Search className="w-4 h-4 text-accent-secondary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Selected</p>
                  <p className="text-sm font-bold text-text-primary">
                    {briefing.meta.selected_stories} stories
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-score-urgency/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-score-urgency" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-text-muted">Reading</p>
                  <p className="text-sm font-bold text-text-primary">
                    {briefing.meta.total_reading_time} / {briefing.minutes} min
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && <LoadingSkeleton count={3} />}

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 text-center"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Story Cards */}
      <AnimatePresence>
        {briefing && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {briefing.stories.map((story, i) => (
              <StoryCard
                key={story.id}
                story={story}
                index={i}
                onFeedback={handleFeedback}
              />
            ))}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!briefing && !loading && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center mx-auto mb-5 border border-border-subtle">
            <Brain className="w-10 h-10 text-accent-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Ready to brief you
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Enter your goal above, select your available time, and Ekai will analyze current news to deliver a personalized, time-optimized briefing.
          </p>
        </motion.div>
      )}

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
