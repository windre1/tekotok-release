'use client'

import { useState, useCallback } from 'react'
import type { Project, Panel } from '@/types/database'
import AudioSection from '@/components/audio/AudioSection'
import PanelCard from '@/components/panels/PanelCard'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Props {
  project: Project
  initialPanels: Panel[]
}

export default function ProjectStudio({ project, initialPanels }: Props) {
  const router = useRouter()
  const [panels, setPanels] = useState<Panel[]>(initialPanels)
  const [script, setScript] = useState(project.script ?? '')
  const [addingPanel, setAddingPanel] = useState(false)

  const updatePanel = useCallback((updated: Panel) => {
    setPanels(prev => prev.map(p => p.id === updated.id ? updated : p))
  }, [])

  async function handleAddPanel() {
    setAddingPanel(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const nextNum = (panels[panels.length - 1]?.panel_number ?? 0) + 1
      const { data, error } = await supabase
        .from('panels')
        .insert({
          project_id: project.id,
          user_id: session.user.id,
          panel_number: nextNum,
          style: 'cinematic',
        })
        .select()
        .single()

      if (error) throw error
      setPanels(prev => [...prev, data])
      toast.success(`Panel #${nextNum} ditambahkan`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setAddingPanel(false)
    }
  }

  return (
    <div>
      {/* Project title bar */}
      <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ color: 'var(--muted)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold text-base truncate">{project.title}</div>
          <div className="text-xs" style={{ color: 'var(--muted)' }}>{panels.length} panel · Stage: {project.stage}</div>
        </div>
        <div
          className="text-xs font-bold px-2.5 py-1 rounded-pill"
          style={{ background: 'rgba(0,212,255,0.15)', color: 'var(--cyan)' }}
        >
          VISUAL DNA
        </div>
      </div>

      {/* Stage chip */}
      <div className="px-4 pt-4 pb-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill text-xs font-bold mb-3"
          style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: 'var(--cyan)', letterSpacing: '1px' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          STAGE 2 — ACTIVE
        </div>
        <h2 className="font-display text-xl font-black">
          Visual DNA <span className="gradient-text">Aggressive Cinematic</span>
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
          Model A/B siap dipakai · Generate per panel atau semua sekaligus
        </p>
      </div>

      {/* Audio Section */}
      <AudioSection project={project} script={script} onScriptChange={setScript} />

      {/* Panels */}
      <div className="px-4 pb-4 space-y-1">
        {panels.map(panel => (
          <PanelCard
            key={panel.id}
            panel={panel}
            projectId={project.id}
            onUpdate={updatePanel}
          />
        ))}
      </div>

      {/* Add Panel button */}
      <div className="px-4 pb-8">
        <button
          onClick={handleAddPanel}
          disabled={addingPanel}
          className="w-full py-4 rounded-2xl text-sm font-bold tracking-wide transition-all disabled:opacity-50"
          style={{
            background: 'transparent',
            border: '1.5px dashed var(--border)',
            color: 'var(--muted)',
          }}
        >
          {addingPanel ? 'Menambahkan...' : '+ TAMBAH PANEL'}
        </button>
      </div>
    </div>
  )
}
