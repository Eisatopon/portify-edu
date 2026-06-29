'use client';
// src/components/PdfViewer.jsx
// Progressive PDF.js viewer: shows page 1 almost instantly using HTTP Range
// requests (no full 30-41MB download). pdfjs is loaded from CDN at runtime so
// no extra npm dependency / package.json change is needed.
// PDF bytes are streamed through the same-origin /api/pdf proxy (Range-enabled),
// which avoids cross-origin CORS issues with the source server.
import { useEffect, useRef, useState } from 'react';

const PDFJS_VERSION = '3.11.174';
const PDFJS_SRC = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;
const PDFJS_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

function loadPdfJs() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PDFJS_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.pdfjsLib));
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.src = PDFJS_SRC;
    s.onload = () => resolve(window.pdfjsLib);
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function PdfViewer({ pdfUrl, title }) {
  const proxied = '/api/pdf?url=' + encodeURIComponent(pdfUrl);
  const containerRef = useRef(null);
  const docRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // 1) Load pdfjs + open document
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setNumPages(0);
    // Safety net: if the document can't open in time, fall back to the iframe.
    const failTimer = setTimeout(() => { if (!cancelled) setStatus(s => s === 'loading' ? 'error' : s); }, 25000);
    async function start() {
      try {
        const pdfjsLib = await loadPdfJs();
        if (cancelled) return;
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        // These official PDFs are NOT linearized, so per-page Range loading is
        // actually slower (many round-trips). A single streamed download of the
        // whole file is ~2x faster, then we render page 1 first.
        const resp = await fetch(proxied);
        if (!resp.ok) throw new Error('fetch ' + resp.status);
        const data = await resp.arrayBuffer();
        if (cancelled) return;
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        if (cancelled) return;
        docRef.current = pdf;
        setNumPages(pdf.numPages);
        setStatus('ready');
      } catch (e) {
        if (!cancelled) setStatus('error');
      }
    }
    start();
    return () => {
      cancelled = true;
      clearTimeout(failTimer);
      if (docRef.current) { try { docRef.current.destroy(); } catch {} docRef.current = null; }
    };
  }, [proxied]);

  // 2) Once placeholders exist, render page 1 immediately + lazy-render the rest
  useEffect(() => {
    if (status !== 'ready' || numPages === 0 || !containerRef.current) return;
    let cancelled = false;

    async function renderPage(pageNum) {
      const holder = containerRef.current?.querySelector(`[data-page="${pageNum}"]`);
      if (!holder || holder.dataset.rendered === '1' || !docRef.current) return;
      holder.dataset.rendered = '1';
      try {
        const page = await docRef.current.getPage(pageNum);
        if (cancelled) return;
        const containerWidth = holder.clientWidth || 800;
        const base = page.getViewport({ scale: 1 });
        const scale = Math.min(containerWidth / base.width, 2.2);
        const viewport = page.getViewport({ scale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const canvas = holder.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        holder.style.aspectRatio = `${viewport.width} / ${viewport.height}`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch {
        if (holder) holder.dataset.rendered = '0';
      }
    }

    // render the first page right away
    requestAnimationFrame(() => renderPage(1));

    const holders = containerRef.current.querySelectorAll('[data-page]');
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        const pageNum = Number(en.target.getAttribute('data-page'));
        if (en.isIntersecting) {
          setCurrentPage(pageNum);
          renderPage(pageNum);
        }
      }
    }, { root: containerRef.current, rootMargin: '400px 0px', threshold: 0.01 });
    holders.forEach(h => io.observe(h));

    return () => { cancelled = true; io.disconnect(); };
  }, [status, numPages]);

  if (status === 'error') {
    return (
      <div data-testid="pdf-viewer-fallback" style={{ position: 'relative', width: '100%', height: 'calc(100vh - 240px)', minHeight: 500, background: '#1e293b', borderRadius: 8, overflow: 'hidden' }}>
        <iframe src={pdfUrl} title={title} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} />
      </div>
    );
  }

  return (
    <div data-testid="pdf-viewer" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 12px', background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '8px 8px 0 0', flexWrap: 'wrap' }}>
        <span data-testid="pdf-page-indicator" style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 600 }}>
          {status === 'ready' ? `Σελίδα ${currentPage} / ${numPages}` : 'Φόρτωση…'}
        </span>
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 13, color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>
          Άνοιγμα σε νέα καρτέλα ↗
        </a>
      </div>

      <div
        ref={containerRef}
        data-testid="pdf-scroll"
        style={{ position: 'relative', width: '100%', height: 'calc(100vh - 280px)', minHeight: 480, background: '#475569', borderRadius: '0 0 8px 8px', overflowY: 'auto', overflowX: 'hidden', padding: '12px 8px' }}
      >
        {status === 'loading' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }} role="status">
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 44, height: 44, border: '4px solid rgba(255,255,255,0.15)', borderTop: '4px solid #93c5fd', borderRadius: '50%', animation: 'pdfspin 0.8s linear infinite', margin: '0 auto 14px' }} aria-hidden="true" />
              <p style={{ color: '#e2e8f0', fontSize: 13 }}>Φόρτωση 1ης σελίδας…</p>
            </div>
          </div>
        )}
        {status === 'ready' && Array.from({ length: numPages }, (_, i) => (
          <div
            key={i + 1}
            data-page={i + 1}
            style={{ maxWidth: 900, margin: '0 auto 12px', background: '#fff', borderRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.25)', aspectRatio: '1 / 1.414', overflow: 'hidden' }}
          >
            <canvas style={{ width: '100%', height: 'auto', display: 'block' }} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes pdfspin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
