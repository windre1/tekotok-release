import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { createRouteClient } from '@/lib/supabase-server'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! })

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
      return NextResponse.json({ error: 'Kredit habis! Upgrade plan kamu.' }, { status: 402 })
    }

    // Enhanced cinematic prompt
    const enhancedPrompt = `${prompt}, diorama miniature, tilt-shift photography, cinematic lighting, ultra detailed, 8k, photorealistic, shallow depth of field, golden hour, epic composition`

    // Generate with Replicate (SDXL)
    const output = await replicate.run(
      'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          prompt: enhancedPrompt,
          negative_prompt: 'blurry, low quality, text, watermark, signature, ugly, deformed',
          width: 768,
          height: 1024,
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
      }
    ) as string[]

    const imageUrl = output[0]
    if (!imageUrl) throw new Error('No image generated')

    // Download and upload to Supabase Storage
    const imageRes = await fetch(imageUrl)
    const imageBuffer = await imageRes.arrayBuffer()
    const fileName = `${session.user.id}/${projectId}/${panelId}-${side}-${Date.now()}.png`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageBuffer, { contentType: 'image/png', upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName)

    // Update panel in DB
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

    // Deduct credit
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', session.user.id)

    return NextResponse.json({ imageUrl: publicUrl, panel: updatedPanel })
  } catch (err: any) {
    console.error('Generate image error:', err)
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
