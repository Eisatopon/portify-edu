'use client'

import PortifyHeader from '@/src/ui/components/PortifyHeader'
import { memo, useState } from 'react'
import { useProducts } from './hooks/useProducts'
import { GREEK_SUPERMARKETS, EUROPEAN_SUPERMARKETS, getFlag } from '@/src/data/supermarkets'

const QUICK_SUGGESTIONS = [
  'Γάλα Νουνού',
  'Nescafé Classic',
  'Coca-Cola 1.5L',
  'Μακαρόνια MISKO',
  'Ελαιόλαδο Minerva',
]

// ─── MarketChips ──────────────────────────────────────────────────────────────

const MarketChips = memo(function MarketChips() {
  return (
    <div className="chips">
      {GREEK_SUPERMARKETS.map((s) => (
        <span key={s.id} className="chip">
          <span className="chip-dot" style={{ background: s.color }} />
          {s.shortName}
        </span>
      ))}
      <div className="chips-divider">
        <div className="chips-divider-line" />
        <span className="chips-divider-label">Ενδεικτικές τιμές Ευρώπης</span>
        <div className="chips-divider-line" />
      </div>
      {EUROPEAN_SUPERMARKETS.map((s) => (
        <span key={s.id} className="chip chip-eu">
          {getFlag(s.country)} {s.shortName}
        </span>
      ))}
    </div>
  )
})

// ─── SearchSection ────────────────────────────────────────────────────────────

function SearchSection({ query, setQuery, loading, onClear, results, onSelect, searchError }) {
  return (
    <div className="fthinatora-search-section">
      <div className="search-container">
        <div className="search-wrap">
          <i className="ti ti-search search-icon" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Γράψε γάλα, καφές, μακαρόνια..."
            aria-label="Αναζήτηση προϊόντος"
            className="focus-ring"
          />
          {query && (
            <button className="btn-clear-input focus-ring" onClick={onClear} aria-label="Καθαρισμός">
              <i className="ti ti-x" aria-hidden="true" />
            </button>
          )}
          <button className="btn-search focus-ring" disabled={loading}>
            {loading ? 'Αναζήτηση...' : 'Σύγκριση →'}
          </button>
        </div>
        {searchError && <p className="search-error">{searchError}</p>}
        {results.length > 0 && (
          <ul className="search-dropdown" role="listbox">
            {results.map((product) => (
              <li key={product.id} role="option">
                <button className="search-result-btn focus-ring" onClick={() => onSelect(product)}>
                  <span className="result-name">{product.name}</span>
                  <span className="result-cat">{product.category}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─── PriceCard ────────────────────────────────────────────────────────────────

function PriceCard({ selected, prices, loadingPrices, priceError, onSuggestionClick }) {

  if (!selected && !loadingPrices) return (
    <div className="empty-state" id="price-card-section">
      <i className="ti ti-search" aria-hidden="true" />
      <p>Αναζήτησε ένα προϊόν για να δεις τιμές</p>
      <div className="empty-suggestions">
        <span className="empty-suggestions-label">Δοκίμασε:</span>
        {QUICK_SUGGESTIONS.map((s) => (
          <button key={s} className="suggestion-btn focus-ring" onClick={() => onSuggestionClick(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )

  if (loadingPrices) return (
    <div className="price-card" id="price-card-section">
      <div className="price-loading">
        <div className="price-loading-spinner" />
        <p>Ψάχνω τιμές σε 10 καταστήματα...</p>
      </div>
    </div>
  )

  if (priceError) return (
    <div className="price-card" id="price-card-section">
      <p className="error-text">{priceError}</p>
    </div>
  )

  const maxPrice    = Math.max(...prices.map(p => p.currentPrice), 1)
  const greekPrices = prices.filter((p) => !p.isEuropean)
  const euPrices    = prices.filter((p) => p.isEuropean)

  return (
    <div className="price-card animate-fade-in" id="price-card-section">
      <div className="card-head">
        <div>
          <div className="prod-name">{selected.name}</div>
          <div className="prod-cat">{selected.category}</div>
        </div>
        {prices[0] && <span className="best-badge">Φθηνότερο: {prices[0].supermarketName}</span>}
      </div>

      <div className="price-rows" aria-live="polite">
        {greekPrices.map((price, idx) => (
          <div key={price.supermarketId} className={`price-row-h ${idx === 0 ? 'best' : ''}`}>
            <span className="pr-rank">{idx + 1}</span>
            <span className="pr-name">{price.supermarketName}</span>
            <div className="pr-bar-wrap">
              <div className={`pr-bar ${idx === 0 ? 'best' : ''}`} style={{ width: `${(price.currentPrice / maxPrice) * 100}%` }} />
            </div>
            {price.oldPrice && <span className="pr-old">{price.oldPrice.toFixed(2)}€</span>}
            {price.oldPrice && <span className="pr-tag">-{Math.round(((price.oldPrice - price.currentPrice) / price.oldPrice) * 100)}%</span>}
            <span className="pr-price">{price.currentPrice.toFixed(2)}€</span>
          </div>
        ))}

        {euPrices.length > 0 && (
          <>
            <div className="prices-divider">
              <div className="prices-divider-line" />
              <span className="prices-divider-label">Ενδεικτικές τιμές Ευρώπης</span>
              <div className="prices-divider-line" />
            </div>
            {euPrices.map((price) => (
              <div key={price.supermarketId} className="price-row-h">
                <span className="pr-rank">—</span>
                <span className="pr-name">{price.flag || getFlag(price.country)} {price.supermarketName}</span>
                <div className="pr-bar-wrap">
                  <div className="pr-bar" style={{ width: `${(price.currentPrice / maxPrice) * 100}%` }} />
                </div>
                <span className="pr-note">ενδεικτική</span>
                <span className="pr-price">{price.currentPrice.toFixed(2)}€</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ─── TrustSection ─────────────────────────────────────────────────────────────

const TrustSection = memo(function TrustSection() {
  return (
    <div className="trust-section">
      <div className="trust-title">Γιατί να εμπιστευτείς το Φθηνά Τώρα</div>
      <div className="trust-items">
        <div className="trust-item-card"><i className="ti ti-check" aria-hidden="true" />Δεδομένα από PosoKanei (Gov.gr)</div>
        <div className="trust-item-card"><i className="ti ti-check" aria-hidden="true" />Καθημερινή ενημέρωση τιμών</div>
        <div className="trust-item-card"><i className="ti ti-check" aria-hidden="true" />Σύγκριση 7 ελληνικών αλυσίδων</div>
        <div className="trust-item-card"><i className="ti ti-check" aria-hidden="true" />Χωρίς διαφημιζόμενες τιμές</div>
      </div>
      <p className="trust-gov">Δεν αποθηκεύουμε προσωπικά στοιχεία</p>
    </div>
  )
})

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FthinaToraPage() {
  const products = useProducts()

  const {
    query, setQuery,
    results, selected,
    prices,
    loading, loadingPrices,
    searchError, priceError,
    selectProduct, clearSearch,
  } = products

  return (
    <main className="fthinatora-page animate-page-in">

      <PortifyHeader serviceId="fthinatora" />

      <SearchSection
        query={query}
        setQuery={setQuery}
        loading={loading}
        onClear={clearSearch}
        results={results}
        onSelect={selectProduct}
        searchError={searchError}
      />

      <div className="trust-bar">
        <div className="trust-item">
          <i className="ti ti-shopping-cart" aria-hidden="true" />
          <span><strong>7</strong> σούπερ μάρκετ</span>
        </div>
        <div className="trust-item">
          <span className="live-dot" aria-hidden="true" />
          <span>Ενημέρωση <strong>10:00</strong></span>
        </div>
        <div className="trust-item">
          <i className="ti ti-database" aria-hidden="true" />
          <span><strong>Καθημερινή</strong> ενημέρωση</span>
        </div>
      </div>

      <MarketChips />

      <div className="main-grid single">
        <PriceCard
          selected={selected}
          prices={prices}
          loadingPrices={loadingPrices}
          priceError={priceError}
          onSuggestionClick={(s) => setQuery(s)}
        />
      </div>

      <TrustSection />

    </main>
  )
}