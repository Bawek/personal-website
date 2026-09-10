import { motion } from 'framer-motion'

export function ProjectCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
    >
      <div className="h-36 bg-gradient-to-br from-violet-900/20 to-pink-900/20 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
        <div className="space-y-2">
          <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
          <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-violet-500/10 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-violet-500/10 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-violet-500/10 rounded-full animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

export function SkillCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded w-24 animate-pulse" />
          <div className="h-3 bg-white/5 rounded w-16 animate-pulse" />
        </div>
      </div>
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-violet-500/20 animate-pulse" />
      </div>
    </motion.div>
  )
}

export function ExperienceCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-white/10 rounded w-48 animate-pulse" />
          <div className="h-4 bg-violet-500/10 rounded w-36 animate-pulse" />
        </div>
        <div className="h-6 bg-white/5 rounded w-20 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-white/5 rounded w-full animate-pulse" />
        <div className="h-3 bg-white/5 rounded w-5/6 animate-pulse" />
      </div>
    </motion.div>
  )
}

export function StatCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5"
    >
      <div className="w-10 h-10 rounded-xl bg-violet-500/10 animate-pulse mb-3" />
      <div className="h-8 bg-white/10 rounded w-20 animate-pulse mb-1" />
      <div className="h-4 bg-white/5 rounded w-24 animate-pulse" />
    </motion.div>
  )
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded bg-white/5 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-32 animate-pulse" />
          <div className="h-3 bg-white/5 rounded w-24 animate-pulse" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
        <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
        <div className="w-8 h-8 rounded-lg bg-white/5 animate-pulse" />
      </div>
    </div>
  )
}
