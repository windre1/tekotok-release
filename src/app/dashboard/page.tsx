import { createServerClient } from '@/lib/supabase-server'
import ProjectCard from '@/components/panels/ProjectCard'
import NewProjectButton from '@/components/panels/NewProjectButton'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', session!.user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const { data: profile } = await supabase
    .from('profiles')
    .select('credits, plan')
    .eq('id', session!.user.id)
    .single()

  return (
    <div className="px-4 py-4">
      {/* Stats bar */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="text-xl font-display font-black gradient-text">{projects?.length ?? 0}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Projects</div>
        </div>
        <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="text-xl font-display font-black" style={{ color: 'var(--cyan)' }}>{profile?.credits ?? 0}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Kredit</div>
        </div>
        <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="text-xl font-display font-black" style={{ color: 'var(--pink)' }}>{profile?.plan?.toUpperCase() ?? 'FREE'}</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Plan</div>
        </div>
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg">Projects Kamu</h2>
        <NewProjectButton />
      </div>

      {/* Projects list */}
      {!projects || projects.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🎬</div>
          <p className="font-semibold mb-1">Belum ada project</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Tap tombol + untuk mulai buat konten viral</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
