'use client'

import { useState, useRef } from 'react'
import type { Project } from '@/types/database'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface Props {
  project: Project
  script: string
  onScriptChange: (s: string) => void
}

export default function AudioSection({ project, script, onScriptChange }: Props) {
  const [voice, setVoice] = useState<'female' | 'male'>(project.voice_gender ?? 'female')
  const [audioUrl, setAudioUrl] = useState(project.audio_url ?? '')
  const [generating, setGenerating] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  async function generateAudio() {
    if (!script.trim()) { toast.error('Isi script dulu!'); return }
    setGenerating(true)
    try {
      const res = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, voice, projectId: project.id }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Gagal generate audio')
      }
      const { audioUrl: url } = await res.json()
      setAudioUrl(url)
      toast.success('Audio berhasil di-generate!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setGenerating(false)
    }
  }

  function togglePlay() {
    if (!audioUrl) { toast.error('Generate audio dulu!'); return }
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl)
      audioRef.current.onended = () => setPlaying(false)
    }
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  async function downloadAudio() {
    if (!audioUrl) { toast.error('Generate audio dulu!'); return }
    const a = document.createElement('a')
    a.href = audioUrl
    a.download = `${project.title}-audio.mp3`
    a.click()
  }

  async function copyScript() {
    if (!script) { toast.error('Script kosong!'); return }
    await navigator.clipboard.writeText(script)
    toast.success('Script disalin!')
  }

  async function saveScript() {
    await supabase.from('projects').update({ script, voice_gender: voice }).eq('id', project.id)
  }

  return (
    <div className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)', position: 'relative' }}>
      {/* Top gradient line */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, var(--pink), var(--cyan))' }} />

      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-bold tracking-widest" style={{ color: 'var(--muted)' }}>🎙 GLOBAL AUDIO</div>
          {/* Recording dot */}
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        </div>
        <div className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
          1 video = 1 naskah = 1 audio (bukan per panel)
        </div>

        {/* Voice toggle */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>VOICE</span>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--card2)' }}>
            {(['female', 'male'] as const).map(v => (
              <button
                key={v}
                onClick={() => setVoice(v)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: voice === v ? 'var(--pink)' : 'transparent',
                  color: voice === v ? '#fff' : 'var(--muted)',
                }}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Audio controls */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            onClick={generateAudio}
            disabled={generating}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--pink), #C8006A)', color: '#fff' }}
          >
            {generating ? (
              <><span className="animate-spin">⟳</span> Generating...</>
            ) : (
              <><MicIcon /> GENERATE AUDIO</>
            )}
          </button>
          <button
            onClick={togglePlay}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'var(--card2)', border: '1px solid var(--border)', color: playing ? 'var(--cyan)' : '#F0F2FF' }}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
            {playing ? 'PAUSE' : 'PLAY'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={downloadAudio}
            disabled={!audioUrl}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-30"
            style={{ background: 'var(--card2)', border: '1px solid var(--border)' }}
          >
            ↓ DOWNLOAD
          </button>
          <button
            onClick={copyScript}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{ background: 'transparent', border: '1.5px solid var(--cyan)', color: 'var(--cyan)' }}
          >
            📋 COPY SCRIPT
          </button>
        </div>

        {/* Script textarea */}
        <textarea
          value={script}
          onChange={e => onScriptChange(e.target.value)}
          placeholder="Tulis naskah video kamu di sini... AI akan membacanya dengan suara yang dipilih."
          rows={5}
          className="w-full text-sm rounded-xl outline-none transition-all"
          style={{
            background: 'var(--dark)',
            border: '1px solid var(--border)',
            color: '#F0F2FF',
            padding: '12px',
            fontFamily: 'inherit',
            lineHeight: '1.7',
            resize: 'none',
          }}
          onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = 'var(--cyan)'}
          onBlur={e => {
            saveScript()
            ;(e.target as HTMLTextAreaElement).style.borderColor = 'var(--border)'
          }}
        />

        {/* Audio status */}
        {audioUrl ? (
          <div className="mt-2 flex items-center gap-2 text-xs font-semibold" style={{ color: '#4ade80' }}>
            <span>✓</span> Audio siap diputar
          </div>
        ) : (
          <div
            className="mt-2 text-xs text-center py-2 rounded-lg"
            style={{ border: '1.5px dashed var(--border)', color: 'var(--muted)' }}
          >
            Belum ada audio. Klik "GENERATE AUDIO".
          </div>
        )}
      </div>
    </div>
  )
}

function MicIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
    </svg>
  )
}
