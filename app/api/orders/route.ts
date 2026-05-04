import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CreateOrderRequest } from '@/lib/types'
import { randomUUID } from 'crypto'

// POST /api/orders
// Buat order setelah user konfirmasi pesanan
export async function POST(req: NextRequest) {
  try {
    const { session_id, menu_id, sweetness_level, unit_price }: CreateOrderRequest =
      await req.json()

    // Generate QR code sederhana (untuk prototype — bisa diganti library QR nanti)
    const qr_code = `JAMOO-${randomUUID().slice(0, 8).toUpperCase()}`

    // Insert order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        session_id,
        menu_id,
        sweetness_level,
        unit_price,
        status: 'pending',
        qr_code,
      })
      .select()
      .single()

    if (error) throw error

    // Update session ke completed
    await supabase
      .from('sessions')
      .update({ status: 'completed' })
      .eq('id', session_id)

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

// GET /api/orders?session_id=xxx
// Ambil order berdasarkan session_id (untuk Order Summary page)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const session_id = searchParams.get('session_id')

    if (!session_id) {
      return NextResponse.json({ error: 'session_id required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        menus (
          id, name, category, description,
          health_badge, image_url, price,
          main_ingredients, benefits
        )
      `)
      .eq('session_id', session_id)
      .single()

    if (error) throw error

    return NextResponse.json({ order: data })
  } catch (err) {
    console.error('[GET /api/orders]', err)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}
