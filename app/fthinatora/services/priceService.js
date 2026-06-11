const BASE_URL = '/fthinatora/api'
const DEFAULT_TIMEOUT = 8000

const API_ACTIONS = {
  SEARCH: 'search',
  PRICES: 'prices',
  BASKET: 'basket',
  OFFERS: 'offers',
}

async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(url, { ...options, signal: options.signal || controller.signal })
    clearTimeout(id)
    return res
  } catch (err) {
    clearTimeout(id)
    if (err.name === 'AbortError') throw new Error('Λήξη χρόνου σύνδεσης')
    throw err
  }
}

async function handleResponse(res) {
  if (!res.ok) {
    let message = `API error ${res.status}`
    try {
      const errData = await res.json()
      message = errData.error || errData.message || message
    } catch { /* ignore */ }
    const error = new Error(message)
    error.status = res.status
    throw error
  }
  return res.json()
}

async function apiGet(action, params = {}, options = {}) {
  const urlParams = new URLSearchParams({ action, ...params })
  const res = await fetchWithTimeout(`${BASE_URL}?${urlParams}`, options)
  return handleResponse(res)
}

async function apiPost(action, body = {}, options = {}) {
  const res = await fetchWithTimeout(`${BASE_URL}?action=${action}`, {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return handleResponse(res)
}

/**
 * Αναζήτηση προϊόντων με βάση λέξη-κλειδί
 */
export async function searchProducts(query, { limit = 20, signal } = {}) {
  const q = query?.trim()
  if (!q || q.length < 2) return []

  const { products = [] } = await apiGet(
    API_ACTIONS.SEARCH,
    { q, limit: String(limit) },
    { signal }
  )
  return products
}

/**
 * Τιμές συγκεκριμένου προϊόντος σε όλα τα supermarkets
 */
export async function getProductPrices(productId, { signal } = {}) {
  if (!productId) return []

  const { prices = [] } = await apiGet(
    API_ACTIONS.PRICES,
    { productId },
    { signal }
  )
  return prices
}

/**
 * Τιμές για λίστα προϊόντων (Έξυπνο Καλάθι)
 */
export async function getBasketPrices(productIds, { signal } = {}) {
  if (!Array.isArray(productIds) || productIds.length === 0) return {}

  const { totals = {} } = await apiPost(
    API_ACTIONS.BASKET,
    { productIds },
    { signal }
  )
  return totals
}

/**
 * Προϊόντα σε προσφορά αυτή τη στιγμή
 */
export async function getOffersOfTheDay(limit = 10, { signal } = {}) {
  const safeLimit = Math.min(Math.max(limit, 1), 50)

  const { offers = [] } = await apiGet(
    API_ACTIONS.OFFERS,
    { limit: String(safeLimit) },
    { signal }
  )
  return offers
}

/**
 * Ταξινόμηση τιμών από φθηνότερο προς ακριβότερο
 */
export function sortPricesByLowest(prices) {
  if (!Array.isArray(prices)) return []
  return [...prices].sort((a, b) => {
    const diff = (a.currentPrice ?? Infinity) - (b.currentPrice ?? Infinity)
    return diff !== 0
      ? diff
      : (a.supermarketName ?? '').localeCompare(b.supermarketName ?? '')
  })
}

/**
 * Εύρεση φθηνότερου supermarket για ένα προϊόν
 */
export function getCheapest(prices) {
  const sorted = sortPricesByLowest(prices)
  return sorted[0] ?? null
}

/**
 * Υπολογισμός ποσοστού έκπτωσης
 */
export function calcDiscount(oldPrice, currentPrice) {
  const old = Number(oldPrice)
  const current = Number(currentPrice)
  if (!old || old <= 0 || !current || current <= 0 || old <= current) return 0
  return Math.max(0, Math.round(((old - current) / old) * 100))
}