'use client'

import { useState } from 'react'

type StockRecord = {
  company: string
  industry: string
  year: number
  basicInfo: string[]
  advancedInfo: string[]
}

type ErrorResponse = {
  error: string
}

type StockAPIResponse = StockRecord | ErrorResponse

const companies = ['宁德时代', '比亚迪', '腾讯控股', '恒瑞医药', '美的集团', '海康威视', '万华化学', '中信证券', '牧原股份', '阿里巴巴']
const years = [2020, 2021, 2022, 2023, 2024]

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [data, setData] = useState<StockAPIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [viewType, setViewType] = useState<'basic' | 'advanced' | null>(null)

  const fetchData = async (company: string, year: number) => {
    setLoading(true)
    setData(null)
    const res = await fetch(`/api/stock/${encodeURIComponent(company)}/${year}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-8 bg-gray-100 text-black">
      <h1 className="text-3xl font-bold mb-6">📊 模拟股票信息查询</h1>

      {/* 公司选择按钮 */}
      <div className="flex flex-wrap gap-3 mb-4">
        {companies.map((name) => (
          <button
            key={name}
            onClick={() => {
              setSelectedCompany(name)
              setSelectedYear(null)
              setData(null)
              setViewType(null)
            }}
            className={`px-4 py-2 rounded ${
              selectedCompany === name ? 'bg-blue-800 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* 年份选择器 */}
      {selectedCompany && (
        <div className="mb-6">
          <h2 className="text-lg mb-2">选择年份：</h2>
          <div className="flex gap-3">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => {
                  setSelectedYear(year)
                  fetchData(selectedCompany, year)
                  setViewType(null)
                }}
                className={`px-4 py-1 rounded ${
                  selectedYear === year ? 'bg-green-700 text-white' : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 加载中提示 */}
      {loading && <p className="text-gray-700">加载中...</p>}

      {/* 错误提示 */}
      {!loading && data && 'error' in data && <p className="text-red-600 mt-4">❌ 查询失败：{data.error}</p>}

      {/* 数据展示 */}
      {!loading && data && 'company' in data && (
        <div className="bg-white p-6 rounded shadow w-full max-w-2xl mt-4">
          <h2 className="text-xl font-bold mb-2">
            {data.company} - {data.year}
          </h2>
          <p>
            <strong>行业：</strong>
            {data.industry}
          </p>

          {/* 选择显示类型按钮 */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => setViewType('basic')}
              className={`px-3 py-1 rounded ${
                viewType === 'basic' ? 'bg-purple-700 text-white' : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              查看初级信息
            </button>
            <button
              onClick={() => setViewType('advanced')}
              className={`px-3 py-1 rounded ${
                viewType === 'advanced' ? 'bg-orange-700 text-white' : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              查看高级信息
            </button>
          </div>

          {/* 根据按钮显示不同内容 */}
          {viewType === 'basic' && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">初级信息：</h3>
              <ul className="list-disc pl-5 space-y-1">
                {data.basicInfo.map((info, i) => (
                  <li key={i}>{info}</li>
                ))}
              </ul>
            </div>
          )}

          {viewType === 'advanced' && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">高级信息：</h3>
              <ul className="list-disc pl-5 space-y-1">
                {data.advancedInfo.map((info, i) => (
                  <li key={i}>{info}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
