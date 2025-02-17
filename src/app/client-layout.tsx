'use client'

import '@/styles/mui-overrides.css'
import '@govbr-ds/core/dist/core.css'
import { useEffect } from 'react'

export default function ClientRootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '/govbr-ds/core-init.js'
    script.defer = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])
  return <div className="br-body">{children}</div>
}
