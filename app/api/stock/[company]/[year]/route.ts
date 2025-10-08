import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

export async function GET(
  request: Request,
  context: { params: { company: string; year: string } }
) {
  try {
    // 解码参数
    const company = decodeURIComponent(context.params.company)
    const year = parseInt(context.params.year)

    // 构造 JSON 文件路径（每家公司一个 JSON 文件）
    const filePath = path.join(process.cwd(), 'public', 'data', `${company}.json`)

    // 判断文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: '未找到公司数据文件' }, { status: 404 })
    }

    // 读取 JSON 文件内容
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw)

    // 查找指定年份的数据
    const matched = parsed.years.find((item: any) => item.year === year)

    if (!matched) {
      return NextResponse.json({ error: '该年份无数据' }, { status: 404 })
    }

    // 返回格式统一的数据对象
    return NextResponse.json({
      company: parsed.company_name || company,
      industry: parsed.sector || '未知行业',               // 使用 sector 映射到前端的 industry
      year: matched.year,
      open: matched.open,
      close: matched.close,
      basicInfo: matched.primary_info || [],              // 保底空数组防止前端报错
      advancedInfo: matched.advanced_info || []
    })
  } catch (err) {
    console.error('Error in API:', err)
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 })
  }
}
