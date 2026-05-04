import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { OrderSource } from '@/lib/types'

// POST /api/sessions
// Buat session baru saat user mulai interaksi
export async function POST(req: NextRequest) {
  try {
    const { order_source }: { order_source: OrderSource } = await req.json()

    if (!['manual', 'questions', 'face'].includes(order_source)) {
      return NextResponse.json(
        { error: 'Invalid order_source' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('sessions')
      .insert({ order_source })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ session: data }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/sessions]', err)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}

// PATCH /api/sessions
// Update status session (completed / abandoned)
export async function PATCH(req: NextRequest) {
  try {
    const { session_id, status } = await req.json()

    const { data, error } = await supabase
      .from('sessions')
      .update({ status })
      .eq('id', session_id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ session: data })
  } catch (err) {
    console.error('[PATCH /api/sessions]', err)
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }
}
