// ── Database types ─────────────────────────────────────────

export type MenuCategory = 'signature' | 'classic' | 'secret'
export type SweetnessLevel = 'normal' | 'less' | 'no_sugar'
export type OrderStatus = 'pending' | 'processing' | 'done' | 'cancelled'
export type SessionStatus = 'active' | 'completed' | 'abandoned'
export type OrderSource = 'manual' | 'questions' | 'face'

export interface Menu {
  id: string
  name: string
  category: MenuCategory
  description: string | null
  main_ingredients: string | null
  health_badge: string | null
  price: number
  image_url: string | null
  benefits: string[]
  mood_tags: string[]
  is_active: boolean
  is_secret: boolean
  stock_qty: number
  secret_persona_name: string | null
  secret_base_ingredients: string | null
  secret_base_benefits: string | null
  created_at: string
}

export interface Session {
  id: string
  order_source: OrderSource
  detected_mood: string | null
  questionnaire: QuestionnaireData | null
  ai_response: unknown | null
  status: SessionStatus
  created_at: string
  completed_at: string | null
}

export interface Order {
  id: string
  session_id: string
  menu_id: string
  sweetness_level: SweetnessLevel
  unit_price: number
  status: OrderStatus
  qr_code: string | null
  created_at: string
}

export interface FaceScanSession {
  id: string
  session_id: string
  dominant_emotion: string
  mapped_mood: string
  confidence_score: number | null
  consent_given: boolean
  image_deleted_at: string | null
  created_at: string
}

// ── Questionnaire data ─────────────────────────────────────
export interface QuestionnaireData {
  mood: string
  feels: string
  sweetness: SweetnessLevel
  free_text?: string
}

// ── LLM Response types ─────────────────────────────────────
export interface RecommendationItem {
  menu_id: string
  menu_name: string
  reason: string
}

export interface RecommendationResponse {
  top3: RecommendationItem[]
}

export interface SecretRecipeResponse {
  persona: string
  recipe_name: string
  ingredients: string
  benefits: string
  narasi: string
  menu_id: string
}

// ── API Request/Response types ─────────────────────────────
export interface RecommendRequest {
  session_id: string
  questionnaire: QuestionnaireData
}

export interface FaceRecommendRequest {
  session_id: string
  dominant_emotion: string
  confidence_score: number
  customer_name: string
  sweetness_level: SweetnessLevel
}

export interface CreateOrderRequest {
  session_id: string
  menu_id: string
  sweetness_level: SweetnessLevel
  unit_price: number
}
