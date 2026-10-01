import { motion } from 'framer-motion'

export default function LoadingSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-5 rounded-full shimmer" />
            <div className="w-12 h-4 rounded shimmer" />
          </div>
          <div className="w-3/4 h-6 rounded shimmer mb-3" />
          <div className="flex gap-2 mb-4">
            <div className="w-14 h-5 rounded shimmer" />
            <div className="w-20 h-5 rounded shimmer" />
            <div className="w-16 h-5 rounded shimmer" />
          </div>
          <div className="space-y-2 mb-4">
            <div className="w-full h-4 rounded shimmer" />
            <div className="w-5/6 h-4 rounded shimmer" />
          </div>
          <div className="flex gap-4">
            <div className="w-24 h-4 rounded shimmer" />
            <div className="w-20 h-4 rounded shimmer" />
            <div className="w-16 h-4 rounded shimmer" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
