export type Category = 'signature' | 'classic' | 'heritage'

export type MenuItem = {
  id: string
  name: string
  shortDescription: string
  fullDescription: string
  price: { regular: number; large: number }
  image: string
  ingredients: string[]
  benefits: string[]
  mood?: string[]
  category: string
  asalDaerah?: string
  health_badge?: string | null
  stock_qty?: number
}

export function formatIDR(value: number): string {
  return `Rp${value.toLocaleString('id-ID')}`
}
