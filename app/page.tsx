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

// 行业映射表：按钮显示行业名，请求时使用公司名
const companyMap: Record<string, string> = {
  '宁德时代': '电池企业',
  '比亚迪': '汽车公司',
  '腾讯控股': '互联网公司',
  '恒瑞医药': '医药公司',
  '美的集团': '家电制造企业',
  '海康威视': '安防科技公司',
  '万华化学': '化工材料企业',
  '中信证券': '证券公司',
  '牧原股份': '养殖企业',
  '阿里巴巴': '电商企业',
}

const years = [2020, 2021, 2022, 2023, 2024]

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [data, setData] = useState<StockAPIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [viewType, setViewType] = useState<'basic' | 'advanced' | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

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
      <h1 className="text-3xl font-bold mb-6">📊 模拟股票行业信息查询</h1>

      {/* 行业按钮 */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(companyMap).map(([company, industry]) => (
          <button
            key={company}
            onClick={() => {
              setSelectedCompany(company)
              setSelectedYear(null)
              setData(null)
              setViewType(null)
              setExpandedIndex(null)
            }}
            className={`px-4 py-2 rounded ${
              selectedCompany === company
                ? 'bg-blue-800 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {industry}
          </button>
        ))}
      </div>

      {/* 年份选择 */}
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
                  setExpandedIndex(null)
                }}
                className={`px-4 py-1 rounded ${
                  selectedYear === year
                    ? 'bg-green-700 text-white'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && <p className="text-gray-700">加载中...</p>}

      {/* 错误信息 */}
      {!loading && data && 'error' in data && (
        <p className="text-red-600 mt-4">❌ 查询失败：{data.error}</p>
      )}

      {/* 数据展示 */}
      {!loading && data && 'company' in data && (
        <div className="bg-white p-6 rounded shadow w-full max-w-2xl mt-4">
          <h2 className="text-xl font-bold mb-2">
            {data.industry} - {data.year}
          </h2>

          {/* 主按钮：选择查看类型 */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                setViewType('basic')
                setExpandedIndex(null)
              }}
              className={`px-3 py-1 rounded ${
                viewType === 'basic'
                  ? 'bg-purple-700 text-white'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              查看初级信息
            </button>
            <button
              onClick={() => {
                setViewType('advanced')
                setExpandedIndex(null)
              }}
              className={`px-3 py-1 rounded ${
                viewType === 'advanced'
                  ? 'bg-orange-700 text-white'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              查看高级信息
            </button>
          </div>

          {/* 初级信息显示 */}
          {viewType === 'basic' && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">初级信息：</h3>
              {data.basicInfo.map((info, i) => (
                <div key={i} className="border rounded mb-2 p-3 bg-gray-50">
                  <button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === i ? null : i)
                    }
                    className="w-full text-left font-medium text-blue-700"
                  >
                    初级信息 {i + 1} {expandedIndex === i ? '▲' : '▼'}
                  </button>
                  {expandedIndex === i && (
                    <p className="mt-2 text-gray-800">{info}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 高级信息显示 */}
          {viewType === 'advanced' && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">高级信息：</h3>
              {data.advancedInfo.map((info, i) => (
                <div key={i} className="border rounded mb-2 p-3 bg-gray-50">
                  <button
                    onClick={() =>
                      setExpandedIndex(expandedIndex === i ? null : i)
                    }
                    className="w-full text-left font-medium text-blue-700"
                  >
                    高级信息 {i + 1} {expandedIndex === i ? '▲' : '▼'}
                  </button>
                  {expandedIndex === i && (
                    <p className="mt-2 text-gray-800">{info}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
