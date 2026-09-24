'use client'
import { useRef, useState } from 'react'
import catalog from '@/data/catalog.json'
type StockRecord = { industry: string; year: number; basicInfo: string[]; advancedInfo: string[] }
export default function Home() {
  const [company, setCompany] = useState('')
  const [year, setYear] = useState<number | null>(null)
  const [data, setData] = useState<StockRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [view, setView] = useState<'basic' | 'advanced' | null>(null)
  const [expanded, setExpanded] = useState<number | null>(null)
  const requestId = useRef(0)
  const selected = catalog.find(item => item.company === company)
  function resetResult() { setData(null); setError(''); setView(null); setExpanded(null) }
  async function query(nextYear: number) {
    const id = ++requestId.current
    setYear(nextYear); resetResult(); setLoading(true)
    try {
      const response = await fetch(`/api/stock/${encodeURIComponent(company)}/${nextYear}`)
      if (!response.ok) throw new Error('Query failed')
      const result: StockRecord = await response.json()
      if (id === requestId.current) setData(result)
    } catch {
      if (id === requestId.current) setError('查询失败，请检查网络后重新点击年份重试。')
    } finally { if (id === requestId.current) setLoading(false) }
  }
  const label = view === 'basic' ? '初级信息' : '高级信息'
  const items = data && view ? (view === 'basic' ? data.basicInfo : data.advancedInfo) : []
  return <main className="query-page">
    <h1>📊 模拟股票行业信息查询</h1>
    <nav className="industry-list" aria-label="选择行业">
      {catalog.map(item => <button key={item.company} className="industry-button" aria-pressed={company === item.company}
        onClick={() => { ++requestId.current; setCompany(item.company); setYear(null); setLoading(false); resetResult() }}>{item.industry}</button>)}
    </nav>
    {selected && <section className="year-picker" aria-label="选择年份"><h2>选择年份：</h2><div className="year-list">
      {selected.years.map(value => <button key={value} className="year-button" aria-pressed={year === value} onClick={() => query(value)}>{value}</button>)}
    </div></section>}
    <div role="status" className="query-status">{loading ? '加载中…' : ''}</div>
    {error && <p role="alert" className="error">{error}</p>}
    {data && <section className="info-card" aria-label="查询结果"><h2>{data.industry} - {data.year}</h2>
      <div className="level-list">
        <button className="basic-button" aria-pressed={view === 'basic'} onClick={() => {setView('basic'); setExpanded(null)}}>查看初级信息</button>
        <button className="advanced-button" aria-pressed={view === 'advanced'} onClick={() => {setView('advanced'); setExpanded(null)}}>查看高级信息</button>
      </div>
      {view && <div className="clues"><h3>{label}：</h3>
        {items.map((info, index) => <div className="clue" key={`${view}-${index}`}>
          <button aria-expanded={expanded === index} aria-controls={`clue-${index}`} onClick={() => setExpanded(expanded === index ? null : index)}>
            {label} {index + 1} <span aria-hidden="true">{expanded === index ? '▲' : '▼'}</span>
          </button>
          {expanded === index && <p id={`clue-${index}`}>{info}</p>}
        </div>)}
      </div>}
    </section>}
  </main>
}
