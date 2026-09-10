import { motion } from 'framer-motion'
import { Table2, Download } from 'lucide-react'

export default function ResultsTable({ results }) {
  if (!results || results.length === 0) {
    return (
      <motion.div className="glass rounded-2xl p-10 text-center"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
        <Table2 size={32} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.15)' }} />
        <p style={{ color: 'rgba(255,255,255,0.35)' }}>Query returned no rows</p>
      </motion.div>
    )
  }

  const columns = Object.keys(results[0])

  const downloadCSV = () => {
    const header = columns.join(',')
    const rows = results.map(r => columns.map(c => `"${r[c] ?? ''}"`).join(','))
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'results.csv'; a.click()
  }

  return (
    <motion.div className="glass rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <Table2 size={14} style={{ color: '#06b6d4' }} />
          <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Results
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs"
            style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4' }}>
            {results.length} row{results.length !== 1 ? 's' : ''}
          </span>
        </div>
        <motion.button onClick={downloadCSV}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'rgba(255,255,255,0.4)' }}
          whileHover={{ borderColor: 'rgba(6,182,212,0.3)', color: '#06b6d4' }}
          whileTap={{ scale: 0.95 }}>
          <Download size={11} />
          CSV
        </motion.button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ maxHeight: '420px', overflowY: 'auto' }}>
        <table className="w-full text-sm">
          <thead style={{ position: 'sticky', top: 0, background: 'rgba(8,8,16,0.95)', backdropFilter: 'blur(8px)' }}>
            <tr>
              {columns.map(col => (
                <th key={col} className="px-5 py-3 text-left text-xs font-semibold tracking-wider"
                  style={{ color: '#8b5cf6', borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <motion.tr key={i} className="result-row"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                {columns.map(col => (
                  <td key={col} className="px-5 py-3"
                    style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'JetBrains Mono, monospace', fontSize: '12.5px', whiteSpace: 'nowrap' }}>
                    {row[col] !== null && row[col] !== undefined ? String(row[col]) : (
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>null</span>
                    )}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
