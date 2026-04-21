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

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.credits < 1) {
      return NextResponse.json({ error: 'Kredit habis! Silakan upgrade plan.' }, { status: 402 })
    }

    // Enhanced cinematic prompt for diorama style
    const enhancedPrompt = `${prompt}, diorama miniature photography, tilt-shift lens effect, cinematic lighting, ultra detailed, 8k resolution, photorealistic, shallow depth of field, golden hour lighting, epic composition, professional photography`

    // ── Fal.ai FLUX API ──────────────────────────────────────────────
    const falResponse = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        image_size: 'portrait_4_3',   // 768x1024 — cocok untuk panel
        num_inference_steps: 4,        // schnell model, cepat
        num_images: 1,
        enable_safety_checker: true,
      }),
    })

    if (!falResponse.ok) {
      const err = await falResponse.json()
      throw new Error(err.detail ?? `Fal.ai error ${falResponse.status}`)
    }

    const falData = await falResponse.json()
    const imageUrl = falData.images?.[0]?.url
    if (!imageUrl) throw new Error('Tidak ada gambar yang dihasilkan')

    // Download gambar dari Fal.ai lalu upload ke Supabase Storage
    const imageRes = await fetch(imageUrl)
    const imageBuffer = await imageRes.arrayBuffer()
    const fileName = `${session.user.id}/${projectId}/${panelId}-${side}-${Date.now()}.png`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageBuffer, { contentType: 'image/png', upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)

    // Update panel record
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

    // Deduct 1 credit
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', session.user.id)

    return NextResponse.json({ imageUrl: publicUrl, panel: updatedPanel })

  } catch (err: any) {
    console.error('generate-image error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
