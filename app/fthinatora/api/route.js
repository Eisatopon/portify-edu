import { NextResponse } from 'next/server'

const POSOKANEI_BASE = process.env.POSOKANEI_API_URL || 'https://api.posokanei.gov.gr'
const POSOKANEI_KEY  = process.env.POSOKANEI_API_KEY || ''
const DEFAULT_TIMEOUT = 8000

if (!POSOKANEI_KEY) {
  console.warn('[fthinatora/api] Missing POSOKANEI_API_KEY')
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  ...(POSOKANEI_KEY && { 'x-api-key': POSOKANEI_KEY }),
}

const ACTIONS = {
  SEARCH:  'search',
  PRICES:  'prices',
  BASKET:  'basket',
  OFFERS:  'offers',
  STATUS:  'status',
}

// ─── helpers ────────────────────────────────────────────────────────────────

const clamp = (value, def, min = 1, max = 50) => {
  const n = Number(value)
  return Math.min(Math.max(isNaN(n) ? def : n, min), max)
}

function errorResponse(message, status = 500) {
  return NextResponse.json({ error: message }, { status })
}

async function posokaneiGet(path, params = {}, revalidate = 3600) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const url = new URL(`${POSOKANEI_BASE}${path}`)
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))

    const res = await fetch(url.toString(), {
      headers: DEFAULT_HEADERS,
      signal: controller.signal,
      next: { revalidate, tags: [path.replace(/\//g, '-').slice(1)] },
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`PosoKanei error ${res.status}: ${text}`)
    }

    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

async function posokaneiPost(path, body = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    const res = await fetch(`${POSOKANEI_BASE}${path}`, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`PosoKanei error ${res.status}: ${text}`)
    }

    return res.json()
  } finally {
    clearTimeout(timer)
  }
}

// ─── action handlers ─────────────────────────────────────────────────────────

async function handleSearch(req, searchParams) {
  const q     = searchParams.get('q')?.trim()
  const limit = clamp(searchParams.get('limit'), 20)

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] })
  }

  const data = await posokaneiGet('/products/search', { q, limit }, 300)
  return NextResponse.json({ products: data.results ?? [] })
}

async function handlePrices(req, searchParams) {
  const productId = searchParams.get('productId')

  if (!productId) return errorResponse('Λείπει το productId', 400)

  const data = await posokaneiGet(`/products/${productId}/prices`, {}, 1800)
  return NextResponse.json({ prices: data.prices ?? [] })
}

async function handleOffers(req, searchParams) {
  const limit = clamp(searchParams.get('limit'), 10)

  const data = await posokaneiGet('/products/offers', { limit }, 1800)
  return NextResponse.json({ offers: data.offers ?? [] })
}

async function handleBasket(req, searchParams) {
  let body
  try {
    body = await req.json()
  } catch {
    return errorResponse('Μη έγκυρο JSON', 400)
  }

  const { productIds } = body

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return errorResponse('Λείπουν τα productIds', 400)
  }
  if (productIds.length > 50) {
    return errorResponse('Μέγιστο 50 προϊόντα ανά αίτημα', 400)
  }
  if (!productIds.every((id) => typeof id === 'string')) {
    return errorResponse('Μη έγκυρα productIds', 400)
  }

  const data = await posokaneiPost('/basket/compare', { productIds })
  return NextResponse.json({ totals: data.totals ?? {} })
}

async function handleStatus(req, searchParams) {
  const health = await posokaneiGet('/health').catch(() => null)
  return NextResponse.json({
    api: health ? 'up' : 'down',
    timestamp: new Date().toISOString(),
  })
}

// ─── dispatcher ──────────────────────────────────────────────────────────────

const HANDLERS = {
  [ACTIONS.SEARCH]:  handleSearch,
  [ACTIONS.PRICES]:  handlePrices,
  [ACTIONS.OFFERS]:  handleOffers,
  [ACTIONS.BASKET]:  handleBasket,
  [ACTIONS.STATUS]:  handleStatus,
}

async function dispatch(req) {
  const { searchParams } = req.nextUrl
  const action = searchParams.get('action')

  const handler = HANDLERS[action]
  if (!handler) return errorResponse('Άγνωστη action', 400)

  try {
    return await handler(req, searchParams)
  } catch (err) {
    console.error('[fthinatora/api]', {
      action,
      message: err.message,
      stack: err.stack,
    })
    const message =
      process.env.NODE_ENV === 'production'
        ? 'Σφάλμα επικοινωνίας με την υπηρεσία'
        : err.message
    return errorResponse(message)
  }
}

// ─── exports ─────────────────────────────────────────────────────────────────

export const GET  = dispatch
export const POST = dispatch