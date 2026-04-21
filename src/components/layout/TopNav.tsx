'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import type { Profile } from '@/types/database'

export default function TopNav({ profile }: { profile: Profile | null }) {
  const router = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
    toast.success('Keluar berhasil')
  }

  return (
    <header
      className="flex items-center justify-between px-5 py-3 sticky top-0 z-50"
      style={{
        background: 'rgba(13,15,26,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="font-display text-lg font-black gradient-text tracking-tight">ViralKit</div>

      <div className="flex items-center gap-3">
        {/* Credits badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold"
          style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--cyan)' }}>✦</span>
          <span>{profile?.credits ?? 0} kredit</span>
        </div>

        {/* Plan badge */}
        <div
          className="px-3 py-1.5 rounded-pill text-xs font-bold"
          style={{ background: 'var(--pink)', color: '#fff' }}
        >
          {profile?.plan?.toUpperCase() ?? 'FREE'}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-70"
          style={{ background: 'var(--card2)', border: '1px solid var(--border)', color: 'var(--muted)' }}
          title="Keluar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
