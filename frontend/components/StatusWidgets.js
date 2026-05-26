import { motion } from 'framer-motion'
import { HiBookOpen, HiCode, HiSparkles } from 'react-icons/hi'

export default function StatusWidgets({ statusWidgets }) {
  if (!statusWidgets) return null

  return (
    <div className="fixed bottom-8 left-8 z-40 flex flex-col gap-3">
      {/* Currently Reading */}
      {statusWidgets.currentlyReading?.enabled && statusWidgets.currentlyReading.bookTitle && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-3 flex items-center gap-3 max-w-xs"
        >
          {statusWidgets.currentlyReading.coverUrl ? (
            <img
              src={statusWidgets.currentlyReading.coverUrl}
              alt="Book cover"
              className="w-12 h-16 object-cover rounded"
            />
          ) : (
            <div className="w-12 h-16 rounded bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
              <HiBookOpen className="text-violet-400" size={20} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-1">Currently Reading</p>
            <p className="text-sm text-white font-medium truncate">{statusWidgets.currentlyReading.bookTitle}</p>
            {statusWidgets.currentlyReading.author && (
              <p className="text-xs text-gray-500 truncate">{statusWidgets.currentlyReading.author}</p>
            )}
          </div>
          {statusWidgets.currentlyReading.link && (
            <a
              href={statusWidgets.currentlyReading.link}
              target="_blank"
              rel="noreferrer"
              className="text-gray-500 hover:text-violet-400 transition-colors flex-shrink-0"
              aria-label="View book"
            >
              <HiSparkles size={16} />
            </a>
          )}
        </motion.div>
      )}

      {/* Currently Building */}
      {statusWidgets.currentlyBuilding?.enabled && statusWidgets.currentlyBuilding.projectName && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-3 flex items-center gap-3 max-w-xs"
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center">
            <HiCode className="text-violet-400" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-1">Currently Building</p>
            <p className="text-sm text-white font-medium truncate">{statusWidgets.currentlyBuilding.projectName}</p>
            {statusWidgets.currentlyBuilding.description && (
              <p className="text-xs text-gray-500 truncate">{statusWidgets.currentlyBuilding.description}</p>
            )}
            {statusWidgets.currentlyBuilding.progress > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-violet-400">{statusWidgets.currentlyBuilding.progress}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${statusWidgets.currentlyBuilding.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}
