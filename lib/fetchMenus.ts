import { supabase } from './supabase'
import type { Menu } from './types'
import type { MenuItem } from '@/src/data/menuData'

const SIZE_UPCHARGE = 6000

export function toMenuItem(m: Menu): MenuItem {
  return {
    id: m.id,
    name: m.name,
    category: m.category,
    shortDescription: m.description ?? '',
    fullDescription: m.description ?? '',
    price: {
      regular: m.price,
      large: m.price + SIZE_UPCHARGE,
    },
    image: m.image_url ?? '',
    ingredients: m.main_ingredients
      ? m.main_ingredients.split(',').map((s) => s.trim())
      : [],
    benefits: m.benefits ?? [],
    mood: m.mood_tags ?? [],
    health_badge: m.health_badge,
    stock_qty: m.stock_qty,
  }
}

export async function fetchMenusByCategory(category: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menus')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .eq('is_secret', false)
    .order('name')

  if (error || !data) return []
  return data.map(toMenuItem)
}
