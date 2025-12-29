import type { ReactNode } from 'react'
import 'antd/dist/reset.css'
import '@/styles/globals.scss';

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
