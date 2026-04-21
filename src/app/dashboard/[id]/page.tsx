import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'
import ProjectStudio from '@/components/panels/ProjectStudio'

export const dynamic = 'force-dynamic'

interface Props {
  params: { id: string }
}

export default async function ProjectPage({ params }: Props) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session!.user.id)
    .single()

  if (!project) notFound()

  const { data: panels } = await supabase
    .from('panels')
    .select('*')
    .eq('project_id', params.id)
    .order('panel_number', { ascending: true })

  return <ProjectStudio project={project} initialPanels={panels ?? []} />
}
