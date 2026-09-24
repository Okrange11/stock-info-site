import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = { title: '模拟股票行业信息查询', description: '社团模拟股票活动行业信息查询' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>
}
