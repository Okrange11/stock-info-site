import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

/** 保障在 Node.js 运行时（允许 fs），且不被静态化/缓存 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Next.js 15.5 期望的签名：params 是 Promise，需要 await
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ company: string; year: string }> }
) {
  try {
    const { company, year } = await context.params
    const decodedCompany = decodeURIComponent(company)
    const yearNum = Number.parseInt(year, 10)

    const filePath = path.join(process.cwd(), 'public', 'data', `${decodedCompany}.json`)
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: `未找到公司数据文件：${decodedCompany}` }, { status: 404 })
    }

    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as {
      company_name?: string
      sector?: string
      years: Array<{
        year: number
        open: number
        close: number
        primary_info?: string[]
        advanced_info?: string[]
      }>
    }

    const matched = parsed.years.find((y) => y.year === yearNum)
    if (!matched) {
      return NextResponse.json({ error: `该年份无数据：${yearNum}` }, { status: 404 })
    }

    // 统一返回前端需要的字段命名
    return NextResponse.json({
      company: parsed.company_name ?? decodedCompany,
      industry: parsed.sector ?? '未知行业',
      year: matched.year,
      open: matched.open,
      close: matched.close,
      basicInfo: matched.primary_info ?? [],
      advancedInfo: matched.advanced_info ?? [],
    })
  } catch (err: any) {
    console.error('API 错误:', err)
    return NextResponse.json({ error: '服务器内部错误', detail: String(err?.message ?? err) }, { status: 500 })
  }
}
