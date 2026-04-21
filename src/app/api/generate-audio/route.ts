import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'

const VOICE_MAP: Record<string, string> = {
  female: 'Zephyr',
  male: 'Puck',
}

function pcmToWav(pcmData: ArrayBuffer, sampleRate: number): ArrayBuffer {
  const numChannels = 1
  const bitsPerSample = 16
  const blockAlign = (numChannels * bitsPerSample) / 8
  const byteRate = sampleRate * blockAlign
  const dataSize = pcmData.byteLength
  const buffer = new ArrayBuffer(44 + dataSize)
  const view = new DataView(buffer)
  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
  writeStr(0, 'RIFF'); view.setUint32(4, 36 + dataSize, true); writeStr(8, 'WAVE')
  writeStr(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true); view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true); view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true); writeStr(36, 'data')
  view.setUint32(40, dataSize, true)
  new Uint8Array(buffer).set(new Uint8Array(pcmData), 44)
  return buffer
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { script, voice = 'female', projectId } = body
    if (!script || !projectId) {
      return NextResponse.json({ error: 'Script dan projectId wajib diisi' }, { status: 400 })
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profileData) {
      return NextResponse.json({ error: 'Profil tidak ditemukan' }, { status: 404 })
    }

    const profile = profileData as { credits: number }

    if (profile.credits < 2) {
      return NextResponse.json({ error: 'Kredit tidak cukup (butuh 2 kredit untuk audio)' }, { status: 402 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) throw new Error('GEMINI_API_KEY belum dikonfigurasi')

    const voiceName = VOICE_MAP[voice] ?? VOICE_MAP.female

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.5-flash-preview-tts',
          contents: [{ parts: [{ text: script }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName } },
            },
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json()
      if (geminiRes.status === 429) throw new Error('Rate limit Gemini. Coba lagi sebentar.')
      throw new Error(err.error?.message ?? `Gemini TTS error ${geminiRes.status}`)
    }

    const geminiData = await geminiRes.json()
    const part = geminiData?.candidates?.[0]?.content?.parts?.[0]
    if (!part?.inlineData?.data) throw new Error('Tidak ada data audio dari Gemini TTS')

    const sampleRate = parseInt(
      part.inlineData.mimeType?.match(/rate=(\d+)/)?.[1] ?? '24000', 10
    )
    const binaryStr = atob(part.inlineData.data)
    const pcmBytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) pcmBytes[i] = binaryStr.charCodeAt(i)
    const wavBuffer = pcmToWav(pcmBytes.buffer, sampleRate)

    const fileName = `${session.user.id}/${projectId}/audio-${Date.now()}.wav`
    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, wavBuffer, { contentType: 'audio/wav', upsert: true })
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(fileName)

    await supabase
      .from('projects' as any)
      .update({ audio_url: publicUrl, voice_gender: voice, script, stage: 'audio' })
      .eq('id', projectId)

    await supabase
      .from('profiles' as any)
      .update({ credits: profile.credits - 2 })
      .eq('id', session.user.id)

    return NextResponse.json({ audioUrl: publicUrl })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('generate-audio error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
