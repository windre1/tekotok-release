'use client'

import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Studio',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
    href: '/dashboard',
  },
  {
    label: 'Library',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    href: '/dashboard/library',
  },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 flex items-end justify-around px-8 pt-2"
      style={{
        background: 'rgba(13,15,26,0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {navItems[0] && (
        <NavItem
          item={navItems[0]}
          active={pathname === navItems[0].href}
          onClick={() => router.push(navItems[0].href)}
        />
      )}

      {/* Center add button */}
      <button
        onClick={() => router.push('/dashboard/new')}
        className="flex items-center justify-center w-12 h-12 rounded-full -mt-5 transition-transform hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, var(--pink), var(--cyan))',
          boxShadow: '0 4px 24px rgba(255,79,163,0.4)',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {navItems[1] && (
        <NavItem
          item={navItems[1]}
          active={pathname === navItems[1].href}
          onClick={() => router.push(navItems[1].href)}
        />
      )}
    </nav>
  )
}

function NavItem({ item, active, onClick }: {
  item: { label: string; icon: React.ReactNode; href: string }
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-6 py-1 rounded-xl transition-all"
      style={{ color: active ? 'var(--pink)' : 'var(--muted)' }}
    >
      {item.icon}
      <span className="text-xs font-semibold">{item.label}</span>
    </button>
  )
}
