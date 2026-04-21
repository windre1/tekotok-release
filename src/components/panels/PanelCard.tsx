'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Panel } from '@/types/database'
import toast from 'react-hot-toast'

interface Props {
  panel: Panel
  projectId: string
  onUpdate: (panel: Panel) => void
}

export default function PanelCard({ panel, projectId, onUpdate }: Props) {
  const [loadingA, setLoadingA] = useState(false)
  const [loadingB, setLoadingB] = useState(false)
  const [promptA, setPromptA] = useState(panel.prompt_a ?? '')
  const [promptB, setPromptB] = useState(panel.prompt_b ?? '')
  const [expanded, setExpanded] = useState(false)

  async function generateImage(side: 'a' | 'b') {
    const prompt = side === 'a' ? promptA : promptB
    if (!prompt.trim()) {
      toast.error('Isi prompt dulu ya!')
      return
    }

    const setLoading = side === 'a' ? setLoadingA : setLoadingB
    setLoading(true)

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, panelId: panel.id, side, projectId }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Gagal generate gambar')
      }

      const { imageUrl, panel: updatedPanel } = await res.json()
      onUpdate(updatedPanel)
      toast.success(`Panel #${panel.panel_number} ${side.toUpperCase()} berhasil!`)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} disalin!`)
    } catch {
      toast.error('Gagal menyalin')
    }
  }

  async function downloadImage(url: string, filename: string) {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
    } catch {
      toast.error('Gagal download')
    }
  }

  const inputStyle = {
    background: 'var(--dark)',
    border: '1px solid var(--border)',
    color: '#F0F2FF',
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '12px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'none' as const,
  }

  return (
    <div className="rounded-2xl overflow-hidden mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      {/* Panel header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-black text-white flex-shrink-0"
          style={{ background: 'var(--pink)' }}
        >
          #{panel.panel_number}
        </div>
        <div className="flex gap-2 flex-1">
          <span className="text-xs font-bold px-2.5 py-1 rounded-pill" style={{ background: 'var(--pink)', color: '#fff' }}>
            A: {panel.label_a ?? 'SETUP'}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-pill" style={{ background: 'var(--cyan)', color: '#000' }}>
            B: {panel.label_b ?? 'KLIMAKS'}
          </span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ color: 'var(--muted)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-2 gap-3 p-3">
        {/* Side A */}
        <ImageSlot
          imageUrl={panel.image_url_a}
          loading={loadingA}
          label="A"
          labelColor="var(--pink)"
          onRegen={() => generateImage('a')}
        />
        {/* Side B */}
        <ImageSlot
          imageUrl={panel.image_url_b}
          loading={loadingB}
          label="B"
          labelColor="var(--cyan)"
          onRegen={() => generateImage('b')}
        />
      </div>

      {/* Expanded prompt area */}
      {expanded && (
        <div className="px-3 pb-3 space-y-3" style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
          {/* Prompt A */}
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--pink)' }}>PROMPT A — SETUP</label>
            <textarea
              value={promptA}
              onChange={e => setPromptA(e.target.value)}
              placeholder="Describe the setup scene... e.g: diorama miniature colonial harbor at golden hour, mist, warm light, cinematic"
              rows={3}
              style={inputStyle}
            />
          </div>
          {/* Prompt B */}
          <div>
            <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--cyan)' }}>PROMPT B — KLIMAKS</label>
            <textarea
              value={promptB}
              onChange={e => setPromptB(e.target.value)}
              placeholder="Describe the climax scene... e.g: dramatic overhead view of massive steam ship arriving at modern port, epic scale"
              rows={3}
              style={inputStyle}
            />
          </div>
          {/* Generate buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => generateImage('a')}
              disabled={loadingA}
              className="py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, var(--pink), #C8006A)', color: '#fff' }}
            >
              {loadingA ? '...' : '✦ GEN A'}
            </button>
            <button
              onClick={() => generateImage('b')}
              disabled={loadingB}
              className="py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, var(--cyan), #008FAA)', color: '#000' }}
            >
              {loadingB ? '...' : '✦ GEN B'}
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="px-3 pb-3 space-y-2" style={{ borderTop: expanded ? '1px solid var(--border)' : 'none', paddingTop: expanded ? '12px' : '0' }}>
        <div className="grid grid-cols-2 gap-2">
          <ActionBtn
            onClick={() => panel.image_url_a && downloadImage(panel.image_url_a, `panel-${panel.panel_number}-A.png`)}
            disabled={!panel.image_url_a}
          >↓ DOWNLOAD A</ActionBtn>
          <ActionBtn
            onClick={() => panel.image_url_b && downloadImage(panel.image_url_b, `panel-${panel.panel_number}-B.png`)}
            disabled={!panel.image_url_b}
          >↓ DOWNLOAD B</ActionBtn>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ActionBtn
            onClick={() => copyToClipboard(promptA, 'Prompt A')}
            disabled={!promptA}
            muted
          >📋 COPY PROMPT A</ActionBtn>
          <ActionBtn
            onClick={() => copyToClipboard(promptB, 'Prompt B')}
            disabled={!promptB}
            muted
          >📋 COPY PROMPT B</ActionBtn>
        </div>
        <ActionBtn
          onClick={() => copyToClipboard(panel.video_prompt ?? `${promptA} | ${promptB}`, 'Video prompt')}
          outline
        >🎬 COPY PROMPT VIDEO</ActionBtn>
      </div>
    </div>
  )
}

function ImageSlot({ imageUrl, loading, label, labelColor, onRegen }: {
  imageUrl: string | null
  loading: boolean
  label: string
  labelColor: string
  onRegen: () => void
}) {
  return (
    <div
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{ aspectRatio: '3/4', background: 'var(--card2)' }}
      onClick={onRegen}
    >
      {/* Label */}
      <div
        className="absolute top-2 left-2 z-10 text-xs font-bold px-2 py-0.5 rounded-pill"
        style={{ background: labelColor, color: label === 'B' ? '#000' : '#fff' }}
      >
        {label}
      </div>

      {/* Image or placeholder */}
      {loading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 shimmer">
          <div className="text-2xl animate-spin">⟳</div>
          <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Generating...</div>
        </div>
      ) : imageUrl ? (
        <Image src={imageUrl} alt={`Panel ${label}`} fill className="object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <div className="text-3xl opacity-30">🖼</div>
          <div className="text-xs font-semibold" style={{ color: 'var(--muted)' }}>Tap to generate</div>
        </div>
      )}

      {/* Regen badge */}
      {imageUrl && !loading && (
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-pill whitespace-nowrap"
          style={{ background: 'rgba(13,15,26,0.9)', border: '1px solid var(--border)' }}
        >
          ↺ REGENERATE
        </div>
      )}
    </div>
  )
}

function ActionBtn({ children, onClick, disabled, muted, outline }: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  muted?: boolean
  outline?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all disabled:opacity-30"
      style={{
        background: outline ? 'transparent' : 'var(--card2)',
        border: outline ? '1.5px solid var(--pink)' : '1px solid var(--border)',
        color: outline ? 'var(--pink)' : muted ? 'var(--muted)' : '#F0F2FF',
      }}
    >
      {children}
    </button>
  )
}
