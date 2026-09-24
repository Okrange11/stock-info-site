import { NextResponse } from 'next/server'
import stocks from '@/data/stocks.json'
export async function GET(_request: Request, context: { params: Promise<{ company: string; year: string }> }) {
  const { company, year } = await context.params
  if (!/^\d{4}$/.test(year)) return NextResponse.json({ error: '年份格式不正确' }, { status: 400 })
  const record = stocks.find(item => item.company === company && item.year === Number(year))
  if (!record) return NextResponse.json({ error: '未找到该行业或年份的信息' }, { status: 404 })
  return NextResponse.json({ industry: record.industry, year: record.year, basicInfo: record.basicInfo, advancedInfo: record.advancedInfo })
}
