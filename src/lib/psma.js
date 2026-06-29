// src/lib/psma.js — Helpers for Digital Learning Objects (ΨΜΑ)
// Data extracted from the official interactive PDFs (ebooksdl.cti.gr).
// Keyed by the unique PDF bitstream id (from book.pdfUrl), NOT the book slug
// (the slug has duplicates across editions).
import psmaData from '@/src/data/psma.json';

const BSID_RE = /\/bitstream\/20\.500\.14040\/(\d+)\//;

export function getBitstreamId(pdfUrl) {
  if (!pdfUrl) return null;
  const m = pdfUrl.match(BSID_RE);
  return m ? m[1] : null;
}

// Returns the array of ΨΜΑ for a given book: [{ id, page, title, url }, ...]
export function getPsmaForBook(book) {
  const id = getBitstreamId(book?.pdfUrl);
  if (!id) return [];
  const items = psmaData[id] || [];
  // sort by page, then by title
  return [...items].sort((a, b) => (a.page - b.page) || String(a.title || '').localeCompare(String(b.title || ''), 'el'));
}
