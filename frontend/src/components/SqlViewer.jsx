import { motion } from 'framer-motion'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql'
import { Code2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

SyntaxHighlighter.registerLanguage('sql', sql)

const customTheme = {
  hljs: { background: 'transparent', color: '#e2e8f0' },
  'hljs-keyword': { color: '#a78bfa', fontWeight: '600' },
  'hljs-built_in': { color: '#67e8f9' },
  'hljs-string': { color: '#6ee7b7' },
  'hljs-number': { color: '#fbbf24' },
  'hljs-operator': { color: '#f472b6' },
  'hljs-punctuation': { color: 'rgba(255,255,255,0.4)' },
  'hljs-comment': { color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' },
}

export default function SqlViewer({ sql: sqlText }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      className="glass rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <Code2 size={14} style={{ color: '#8b5cf6' }} />
          <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Generated SQL
          </span>
        </div>
        <motion.button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs transition-all"
          style={{
            background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
            color: copied ? '#10b981' : 'rgba(255,255,255,0.4)',
          }}
          whileTap={{ scale: 0.95 }}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? 'Copied!' : 'Copy'}
        </motion.button>
      </div>

      {/* SQL code */}
      <div className="px-5 py-4 sql-block overflow-x-auto">
        <SyntaxHighlighter language="sql" style={customTheme} wrapLines>
          {sqlText}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  )
}
