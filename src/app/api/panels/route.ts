import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import type { Database } from '@/types/database'

// GET panels by project
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteClient()
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get('projectId')
    if (!projectId) return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })

    const { data, error } = await supabase
      .from('panels' as any)
      .select('*')
      .eq('project_id', projectId)
      .eq('user_id', session.user.id)
      .order('panel_number')

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ panels: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

// PATCH (update) panel
export async function PATCH(req: NextRequest) {
  try {
    const supabase = createRouteClient()
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { panelId, ...updates } = await req.json()
    if (!panelId) return NextResponse.json({ error: 'Missing panelId' }, { status: 400 })

    const panelUpdates: Database['public']['Tables']['panels']['Update'] = updates

    const { data, error } = await supabase
      .from('panels' as any)
      // @ts-ignore
      .update(panelUpdates)
      .eq('id', panelId)
      .eq('user_id', session.user.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ panel: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

// DELETE panel
export async function DELETE(req: NextRequest) {
  try {
    const supabase = createRouteClient()
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const panelId = searchParams.get('panelId')
    if (!panelId) return NextResponse.json({ error: 'Missing panelId' }, { status: 400 })

    const { error } = await supabase
      .from('panels' as any)
      .delete()
      .eq('id', panelId)
      .eq('user_id', session.user.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}