import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { prompt, panelId, side, projectId } = body
    if (!prompt || !panelId || !side) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
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

    if (profile.credits < 1) {
      return NextResponse.json({ error: 'Kredit habis! Silakan upgrade plan.' }, { status: 402 })
    }

    const falApiKey = process.env.FAL_API_KEY
    if (!falApiKey) throw new Error('FAL_API_KEY belum dikonfigurasi')

    const enhancedPrompt = `${prompt}, diorama miniature photography, tilt-shift lens effect, cinematic lighting, ultra detailed, 8k resolution, photorealistic, shallow depth of field, golden hour lighting, epic composition, professional photography`

    const falResponse = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        image_size: 'portrait_4_3',
        num_inference_steps: 4,
        num_images: 1,
        enable_safety_checker: true,
      }),
    })

    if (!falResponse.ok) {
      const err = await falResponse.json()
      throw new Error(err.detail ?? `Fal.ai error ${falResponse.status}`)
    }

    const falData = await falResponse.json()
    const imageUrl: string = falData.images?.[0]?.url
    if (!imageUrl) throw new Error('Tidak ada gambar yang dihasilkan')

    // Download & upload ke Supabase Storage
    const imageRes = await fetch(imageUrl)
    const imageBuffer = await imageRes.arrayBuffer()
    const fileName = `${session.user.id}/${projectId}/${panelId}-${side}-${Date.now()}.png`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageBuffer, { contentType: 'image/png', upsert: true })
    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)

    const updateData = side === 'a'
      ? { image_url_a: publicUrl, prompt_a: prompt }
      : { image_url_b: publicUrl, prompt_b: prompt }

    const { data: updatedPanel, error: updateError } = await supabase
      .from('panels')
      .update(updateData)
      .eq('id', panelId)
      .select()
      .single()
    if (updateError) throw updateError

    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', session.user.id)

    return NextResponse.json({ imageUrl: publicUrl, panel: updatedPanel })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    console.error('generate-image error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
