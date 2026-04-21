'use client'

import { useRouter } from 'next/navigation'

export default function NewProjectButton() {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push('/dashboard/new')}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold transition-all hover:opacity-80"
      style={{ background: 'linear-gradient(135deg, var(--pink), #C8006A)', color: '#fff' }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Baru
    </button>
  )
}
