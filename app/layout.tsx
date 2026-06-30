import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Студия Айгерим',
  description: 'Система записи для студии маникюра',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
