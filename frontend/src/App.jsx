import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Header from './components/Header'
import QueryInput from './components/QueryInput'
import SqlViewer from './components/SqlViewer'
import ResultsTable from './components/ResultsTable'
import QueryHistory from './components/QueryHistory'
import { AlertCircle, Sparkles, Zap, Shield, Database } from 'lucide-react'

const FEATURES = [
  { icon: Sparkles, label: 'AI-Powered', desc: 'Gemini 3.6 Flash converts plain English to SQL', color: '#8b5cf6' },
  { icon: Shield, label: 'Read-Only Safe', desc: 'All queries are validated — only SELECT allowed', color: '#10b981' },
  { icon: Database, label: 'Schema-Aware', desc: 'AI sees your actual tables and columns', color: '#06b6d4' },
  { icon: Zap, label: 'Instant Results', desc: 'Query executes and returns in milliseconds', color: '#f59e0b' },
]

export default function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState('')

  const handleSubmit = async (question) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setCurrentQuestion(question)

    try {
      const { data } = await axios.post('/api/query', { question })
      setResult(data)
      setHistory(prev => [{
        id: Date.now(),
        question,
        sql: data.sql,
        rowCount: data.results?.length ?? 0,
        timestamp: new Date().toLocaleTimeString(),
        data,
      }, ...prev].slice(0, 20))
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleHistorySelect = (item) => {
    setCurrentQuestion(item.question)
    setResult(item.data)
    setError(null)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Background decorations */}
      <div className="bg-grid" />
      <div className="bg-orb" style={{ width: 600, height: 600, top: -200, left: -200, background: 'rgba(139,92,246,0.06)' }} />
      <div className="bg-orb" style={{ width: 400, height: 400, bottom: -100, right: -100, background: 'rgba(6,182,212,0.05)' }} />

      <Header />

      <main className="relative z-10 flex-1 flex gap-6 p-6 max-w-screen-xl mx-auto w-full">

        {/* Left sidebar — History */}
        <aside className="w-72 flex-shrink-0 flex flex-col gap-4">
          <QueryHistory
            history={history}
            onSelect={handleHistorySelect}
            onClear={() => setHistory([])}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col gap-5 min-w-0">

          {/* Query Input */}
          <QueryInput onSubmit={handleSubmit} loading={loading} />

          {/* Loading skeleton */}
          <AnimatePresence>
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="glass rounded-2xl p-5 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full pulse" style={{ background: '#8b5cf6' }} />
                    <div className="w-3 h-3 rounded-full pulse-2" style={{ background: '#8b5cf6' }} />
                    <div className="w-3 h-3 rounded-full pulse-3" style={{ background: '#8b5cf6' }} />
                    <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Gemini is thinking…
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 rounded shimmer" style={{ width: '75%' }} />
                    <div className="h-3 rounded shimmer" style={{ width: '55%' }} />
                  </div>
                </div>
                <div className="glass rounded-2xl p-5">
                  <div className="space-y-3">
                    {[100, 80, 60].map((w, i) => (
                      <div key={i} className="h-3 rounded shimmer" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div key="error"
                className="glass rounded-2xl p-4 flex items-start gap-3"
                style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#f87171' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: '#f87171' }}>Query failed</p>
                  <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && !loading && (
              <motion.div key="result" className="flex flex-col gap-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SqlViewer sql={result.sql} />
                <ResultsTable results={result.results} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state / Feature cards */}
          <AnimatePresence>
            {!result && !loading && !error && (
              <motion.div key="empty"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="grid grid-cols-2 gap-3 mt-2">
                {FEATURES.map(({ icon: Icon, label, desc, color }, i) => (
                  <motion.div key={label} className="glass rounded-2xl p-5"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ borderColor: `${color}40`, y: -2 }}
                    style={{ transition: 'border-color 0.2s, transform 0.2s' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>{desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
