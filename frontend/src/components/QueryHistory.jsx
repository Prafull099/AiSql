import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Trash2, ChevronRight, History } from 'lucide-react'

export default function QueryHistory({ history, onSelect, onClear }) {
  if (history.length === 0) {
    return (
      <div className="glass rounded-2xl p-5 text-center">
        <History size={24} className="mx-auto mb-2" style={{ color: 'rgba(255,255,255,0.15)' }} />
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>No history yet</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>Your queries will appear here</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <Clock size={13} style={{ color: '#8b5cf6' }} />
          <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
            History
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-xs"
            style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>
            {history.length}
          </span>
        </div>
        {history.length > 0 && (
          <button onClick={onClear}
            className="text-xs flex items-center gap-1 transition-colors"
            style={{ color: 'rgba(255,255,255,0.25)' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}>
            <Trash2 size={10} />
            Clear
          </button>
        )}
      </div>

      {/* Items */}
      <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <AnimatePresence>
          {history.map((item, i) => (
            <motion.button key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left px-4 py-3 flex items-start gap-3 group transition-all duration-150"
              style={{ background: 'transparent' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(139,92,246,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}>

              <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
                style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.2)' }}>
                <span className="text-xs font-bold" style={{ color: '#8b5cf6' }}>{i + 1}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {item.question}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>
                  {item.sql}
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '10px' }}>
                  {item.timestamp} · {item.rowCount} row{item.rowCount !== 1 ? 's' : ''}
                </p>
              </div>

              <ChevronRight size={12} className="mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: '#8b5cf6' }} />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
