import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Sparkles } from 'lucide-react'

const PLACEHOLDERS = [
  'Which customer spent the most?',
  'Show all orders from last month',
  'What is the total revenue?',
  'How many orders did Alice place?',
  'Show top 5 products by sales',
  'Which orders are above $400?',
]

export default function QueryInput({ onSubmit, loading }) {
  const [question, setQuestion] = useState('')
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const textareaRef = useRef(null)

  // Cycling animated placeholder
  useEffect(() => {
    const target = PLACEHOLDERS[placeholderIdx]
    let i = 0
    setDisplayedPlaceholder('')
    setIsTyping(true)

    const typeInterval = setInterval(() => {
      if (i <= target.length) {
        setDisplayedPlaceholder(target.slice(0, i))
        i++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        setTimeout(() => {
          setPlaceholderIdx(prev => (prev + 1) % PLACEHOLDERS.length)
        }, 2500)
      }
    }, 45)

    return () => clearInterval(typeInterval)
  }, [placeholderIdx])

  const handleSubmit = () => {
    if (!question.trim() || loading) return
    onSubmit(question.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-px rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.3))', filter: 'blur(8px)', zIndex: -1 }} />

      <motion.div
        className="glass rounded-2xl overflow-hidden"
        style={{ border: '1px solid rgba(139,92,246,0.2)' }}
        whileFocusWithin={{ boxShadow: '0 0 0 1px rgba(139,92,246,0.3), 0 0 60px rgba(139,92,246,0.08)' }}
        transition={{ duration: 0.3 }}>

        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <Sparkles size={14} style={{ color: '#8b5cf6' }} />
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Ask anything about your data
          </span>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={displayedPlaceholder + (isTyping ? '|' : '')}
          disabled={loading}
          rows={2}
          className="query-input w-full px-4 py-2 text-base resize-none"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#e2e8f0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            lineHeight: '1.6',
          }}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-4 pb-4 pt-2">
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Press Enter to run · Shift+Enter for new line
          </span>
          <motion.button
            onClick={handleSubmit}
            disabled={!question.trim() || loading}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: question.trim() && !loading
                ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)'
                : 'rgba(255,255,255,0.06)',
              color: question.trim() && !loading ? 'white' : 'rgba(255,255,255,0.3)',
              cursor: question.trim() && !loading ? 'pointer' : 'not-allowed',
            }}
            whileHover={question.trim() && !loading ? { scale: 1.03 } : {}}
            whileTap={question.trim() && !loading ? { scale: 0.97 } : {}}>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 size={14} className="animate-spin" />
                </motion.div>
              ) : (
                <motion.div key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Send size={14} />
                </motion.div>
              )}
            </AnimatePresence>
            {loading ? 'Thinking...' : 'Run Query'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
