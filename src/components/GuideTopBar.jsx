// Shared brand top bar for guide/content pages (server component).
import Link from 'next/link';

export default function GuideTopBar() {
  return (
    <div style={{ borderBottom: '1px solid var(--border, #e5e7eb)', background: 'var(--card, #fff)' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '14px 20px' }}>
        <Link href="/" data-testid="guide-brand-home" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-1)' }}>Portify</span>
          <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Σχολικά Βιβλία</span>
        </Link>
      </div>
    </div>
  );
}
