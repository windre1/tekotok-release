import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!
const VOICE_IDS = {
  female: process.env.ELEVENLABS_VOICE_ID_FEMALE ?? 'EXAVITQu4vr4xnSDxMaL',
  male: process.env.ELEVENLABS_VOICE_ID_MALE ?? 'VR6AewLTigWG4xSOukaG',
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { script, voice = 'female', projectId } = body

    if (!script || !projectId) {
      return NextResponse.json({ error: 'Missing script or projectId' }, { status: 400 })
    }

    // Check credits (audio costs 2 credits)
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.credits < 2) {
      return NextResponse.json({ error: 'Kredit tidak cukup! Butuh 2 kredit untuk audio.' }, { status: 402 })
    }

    const voiceId = VOICE_IDS[voice as keyof typeof VOICE_IDS] ?? VOICE_IDS.female

    // Call ElevenLabs TTS API
    const elevenRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: script,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true,
        },
      }),
    })

    if (!elevenRes.ok) {
      const errText = await elevenRes.text()
      throw new Error(`ElevenLabs error: ${errText}`)
    }

    const audioBuffer = await elevenRes.arrayBuffer()
    const fileName = `${session.user.id}/${projectId}/audio-${Date.now()}.mp3`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, audioBuffer, { contentType: 'audio/mpeg', upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('audio').getPublicUrl(fileName)

    // Update project with audio URL and voice
    await supabase
      .from('projects')
      .update({ audio_url: publicUrl, voice_gender: voice, script, stage: 'audio' })
      .eq('id', projectId)

    // Deduct 2 credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 2 })
      .eq('id', session.user.id)

    return NextResponse.json({ audioUrl: publicUrl })
  } catch (err: any) {
    console.error('Generate audio error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
