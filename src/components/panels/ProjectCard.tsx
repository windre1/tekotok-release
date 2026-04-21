'use client'

import Link from 'next/link'
import type { Project } from '@/types/database'

const stageColors: Record<string, string> = {
  script: 'var(--muted)',
  visual: 'var(--cyan)',
  audio: 'var(--pink)',
  done: '#4ade80',
}

const stageLabels: Record<string, string> = {
  script: 'Script',
  visual: 'Visual',
  audio: 'Audio',
  done: 'Selesai',
}

export default function ProjectCard({ project }: { project: Project }) {
  const color = stageColors[project.stage] ?? 'var(--muted)'
  const label = stageLabels[project.stage] ?? project.stage

  return (
    <Link href={`/dashboard/${project.id}`}>
      <div
        className="rounded-2xl p-4 flex items-center gap-4 transition-all active:scale-98 hover:border-opacity-60"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'var(--card2)' }}
        >
          🎬
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{project.title}</div>
          <div className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>
            {project.topic ? project.topic.slice(0, 60) + '...' : 'Belum ada topik'}
          </div>
        </div>

        {/* Stage badge */}
        <div
          className="flex-shrink-0 px-2.5 py-1 rounded-pill text-xs font-bold"
          style={{ background: `${color}20`, color }}
        >
          {label}
        </div>
      </div>
    </Link>
  )
}
