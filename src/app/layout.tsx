import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'ViralKit — AI Video Content Generator',
  description: 'Generate cinematic A/B image pairs and voiceover scripts for viral short videos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ViralKit',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0D0F1A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1E2138',
              color: '#F0F2FF',
              border: '1px solid #2A2E4A',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: '600',
            },
          }}
        />
      </body>
    </html>
  )
}
