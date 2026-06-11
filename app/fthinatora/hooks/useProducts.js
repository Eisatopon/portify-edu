'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  searchProducts,
  getProductPrices,
  getOffersOfTheDay,
  sortPricesByLowest,
  getCheapest,
} from '../services/priceService'

const DEBOUNCE_MS = 400

// ─── helper ───────────────────────────────────────────────────────────────────

function handleNonAbortError(err, fallbackMessage, setErrorFn) {
  if (err.name === 'AbortError') return
  setErrorFn(err.message || fallbackMessage)
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export function useProducts() {
  const [query, setQuery]               = useState('')
  const [results, setResults]           = useState([])
  const [selected, setSelected]         = useState(null)
  const [prices, setPrices]             = useState([])
  const [offers, setOffers]             = useState([])

  const [loading, setLoading]           = useState(false)
  const [loadingPrices, setLoadingPrices] = useState(false)
  const [loadingOffers, setLoadingOffers] = useState(false)

  const [searchError, setSearchError]   = useState(null)
  const [priceError, setPriceError]     = useState(null)
  const [offersError, setOffersError]   = useState(null)

  const abortRef        = useRef(null)
  const debounceRef     = useRef(null)
  const skipSearchRef   = useRef(false)
  const priceRequestId  = useRef(0)

  // ─── search με debounce + cancellation ──────────────────────────────────────

  const runSearch = useCallback(async (q) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setSearchError(null)

    try {
      const products = await searchProducts(q, { signal: controller.signal })
      setResults(products)
    } catch (err) {
      handleNonAbortError(err, 'Σφάλμα αναζήτησης', setSearchError)
      if (err.name !== 'AbortError') setResults([])
    } finally {
      if (abortRef.current === controller) setLoading(false)
    }
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)

    if (!query || query.trim().length < 2) {
      setResults([])
      setSearchError(null)
      return
    }

    if (skipSearchRef.current) {
      skipSearchRef.current = false
      return
    }

    let mounted = true

    debounceRef.current = setTimeout(() => {
      if (mounted) runSearch(query.trim())
    }, DEBOUNCE_MS)

    return () => {
      mounted = false
      clearTimeout(debounceRef.current)
    }
  }, [query, runSearch])

  // ─── φόρτωση τιμών όταν επιλεγεί προϊόν ────────────────────────────────────

  useEffect(() => {
    if (!selected?.id) {
      setPrices([])
      return
    }

    const currentId = ++priceRequestId.current
    const controller = new AbortController()

    async function loadPrices() {
      setLoadingPrices(true)
      setPriceError(null)

      try {
        const raw = await getProductPrices(selected.id, { signal: controller.signal })
        if (currentId !== priceRequestId.current) return
        setPrices(sortPricesByLowest(raw))
      } catch (err) {
        if (currentId !== priceRequestId.current) return
        handleNonAbortError(err, 'Σφάλμα φόρτωσης τιμών', setPriceError)
        if (err.name !== 'AbortError') setPrices([])
      } finally {
        if (currentId === priceRequestId.current) setLoadingPrices(false)
      }
    }

    loadPrices()
    return () => controller.abort()
  }, [selected])

  // ─── φόρτωση προσφορών ημέρας ────────────────────────────────────────────────

  useEffect(() => {
    const controller = new AbortController()

    async function loadOffers() {
      setLoadingOffers(true)
      setOffersError(null)

      try {
        const data = await getOffersOfTheDay(10, { signal: controller.signal })
        setOffers(data)
      } catch (err) {
        handleNonAbortError(err, 'Σφάλμα φόρτωσης προσφορών', setOffersError)
      } finally {
        setLoadingOffers(false)
      }
    }

    loadOffers()
    return () => controller.abort()
  }, [])

  // ─── derived ─────────────────────────────────────────────────────────────────

  const cheapest   = useMemo(() => getCheapest(prices), [prices])
  const hasResults = results.length > 0
  const hasPrices  = prices.length > 0

  // ─── actions ─────────────────────────────────────────────────────────────────

  const selectProduct = useCallback((product) => {
    skipSearchRef.current = true
    setSelected(product)
    setQuery(product.name || '')
    setResults([])
    setSearchError(null)
  }, [])

  const clearSearch = useCallback(() => {
    skipSearchRef.current = false
    abortRef.current?.abort()
    clearTimeout(debounceRef.current)
    setQuery('')
    setResults([])
    setSelected(null)
    setPrices([])
    setSearchError(null)
    setPriceError(null)
  }, [])

  return {
    // state
    query,
    setQuery,
    results,
    selected,
    prices,
    offers,
    // loading
    loading,
    loadingPrices,
    loadingOffers,
    // errors
    searchError,
    priceError,
    offersError,
    // derived
    cheapest,
    hasResults,
    hasPrices,
    // actions
    selectProduct,
    clearSearch,
  }
}