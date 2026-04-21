'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

const STYLES = [
  { id: 'cinematic', label: 'Cinematic', emoji: '🎬' },
  { id: 'diorama', label: 'Diorama', emoji: '🏛️' },
  { id: 'documentary', label: 'Documentary', emoji: '📹' },
  { id: 'dramatic', label: 'Dramatic', emoji: '⚡' },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('cinematic')
  const [panelCount, setPanelCount] = useState(6)
  const [loading, setLoading] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          user_id: session.user.id,
          title: title || `Project ${new Date().toLocaleDateString('id-ID')}`,
          topic,
          stage: 'visual',
        })
        .select()
        .single()

      if (error) throw error

      // Create empty panels
      const panelInserts = Array.from({ length: panelCount }, (_, i) => ({
        project_id: project.id,
        user_id: session.user.id,
        panel_number: i + 1,
        style,
      }))

      await supabase.from('panels').insert(panelInserts)

      toast.success('Project dibuat!')
      router.push(`/dashboard/${project.id}`)
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat project')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'var(--card2)',
    border: '1px solid var(--border)',
    color: '#F0F2FF',
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
  }

  return (
    <div className="px-4 py-4">
      <div className="mb-5">
        <h1 className="font-display text-2xl font-black">Project Baru</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Setup konten viral kamu</p>
      </div>

      <form onSubmit={handleCreate} className="space-y-5">
        <div>
          <label className="block text-xs font-bold tracking-widest mb-2" style={{ color: 'var(--muted)' }}>JUDUL PROJECT</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Contoh: Sejarah Tanjung Priok"
            style={inputStyle}
            onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--cyan)'}
            onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'var(--border)'}
          />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest mb-2" style={{ color: 'var(--muted)' }}>TOPIK / NASKAH AWAL</label>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="Ceritakan topik yang ingin diangkat. AI akan generate prompt gambar dan audio otomatis."
            rows={4}
            style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }}
            onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--cyan)'}
            onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'}
          />
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--muted)' }}>VISUAL STYLE</label>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: style === s.id ? 'linear-gradient(135deg, rgba(255,79,163,0.2), rgba(0,212,255,0.1))' : 'var(--card2)',
                  border: `1px solid ${style === s.id ? 'var(--pink)' : 'var(--border)'}`,
                  color: style === s.id ? '#F0F2FF' : 'var(--muted)',
                }}
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
            JUMLAH PANEL — <span style={{ color: 'var(--cyan)' }}>{panelCount}</span>
          </label>
          <input
            type="range"
            min={2}
            max={12}
            value={panelCount}
            onChange={e => setPanelCount(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: 'var(--pink)' }}
          />
          <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--muted)' }}>
            <span>2</span><span>12</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold tracking-wide text-sm transition-all disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg, var(--pink), #C8006A)',
            color: '#fff',
            border: 'none',
          }}
        >
          {loading ? 'Membuat project...' : '✦ BUAT PROJECT'}
        </button>
      </form>
    </div>
  )
}
