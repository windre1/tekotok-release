import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import BottomNav from '@/components/layout/BottomNav'
import TopNav from '@/components/layout/TopNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="min-h-screen" style={{ background: 'var(--dark)' }}>
      <div className="max-w-lg mx-auto relative">
        <TopNav profile={profile} />
        <main className="pb-safe">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
