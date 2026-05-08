import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { toMenuItem } from '@/lib/fetchMenus'

// GET /api/menus
// Ambil semua menu non-secret. Optional query param: ?category=signature|classic|heritage
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('menus')
      .select('*')
      .eq('is_active', true)
      .eq('is_secret', false)
      .order('name')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ menus: (data ?? []).map(toMenuItem) })
  } catch (err) {
    console.error('[GET /api/menus]', err)
    return NextResponse.json({ error: 'Failed to fetch menus' }, { status: 500 })
  }
}
