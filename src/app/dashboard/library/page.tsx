import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'

export default async function LibraryPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', session!.user.id)
    .order('created_at', { ascending: false })

  const active = projects?.filter(p => p.status === 'active') ?? []
  const archived = projects?.filter(p => p.status === 'archived') ?? []

  return (
    <div className="px-4 py-4">
      <h1 className="font-display text-xl font-black mb-4">Library</h1>

      <div className="mb-5">
        <div className="text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
          AKTIF ({active.length})
        </div>
        {active.length === 0 ? (
          <div className="text-sm text-center py-8" style={{ color: 'var(--muted)' }}>
            Belum ada project aktif
          </div>
        ) : (
          <div className="space-y-2">
            {active.map(p => (
              <Link key={p.id} href={`/dashboard/${p.id}`}>
                <div className="flex items-center gap-3 p-3 rounded-xl transition-all"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="text-2xl">🎬</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{p.title}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--muted)', flexShrink: 0 }}>
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {archived.length > 0 && (
        <div>
          <div className="text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
            ARSIP ({archived.length})
          </div>
          <div className="space-y-2">
            {archived.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl opacity-50"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="text-2xl">📦</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.title}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>Diarsipkan</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
