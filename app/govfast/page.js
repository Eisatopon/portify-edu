'use client';
import PortifyHeader from "@/src/ui/components/PortifyHeader";
import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SERVICES, CAT_LABELS, CAT_BADGE, FILTERS, DIFFICULTY } from "@/src/data/govfastServices";

function matchesSearch(s, q) {
  const lower = q.toLowerCase();
  return (
    s.name.toLowerCase().includes(lower) ||
    s.desc.toLowerCase().includes(lower) ||
    s.keywords?.some(k => k.toLowerCase().includes(lower))
  );
}

function GovFastSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="h-16 bg-gray-100 mb-4" />
      <div className="h-12 bg-gray-100 mx-8 mb-4 rounded-lg" />
      <div className="grid grid-cols-3 gap-4 px-8">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl" />)}
      </div>
    </div>
  );
}

function GovFastPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState('popular');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const lastActiveRef = useRef('popular');

  const serviceId = searchParams.get('service');
  const selected = serviceId ? SERVICES.find(s => s.id === serviceId) : null;

  useEffect(() => { if (serviceId) window.scrollTo(0, 0); }, [serviceId]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = useMemo(() =>
    SERVICES.filter(s =>
      debouncedSearch ? matchesSearch(s, debouncedSearch) :
      active === 'popular'
        ? s.score >= 70
        : s.cat === active
    ).sort((a, b) => b.score - a.score),
    [debouncedSearch, active]
  );

  const sectionTitle = useMemo(() => {
    if (debouncedSearch) return 'Αποτελέσματα αναζήτησης';
    if (active === 'popular') return 'Δημοφιλείς υπηρεσίες';
    return CAT_LABELS[active];
  }, [debouncedSearch, active]);

  const selectService = (id) => router.push(`/govfast?service=${id}`, { scroll: false });
  const goBack = () => router.replace('/govfast', { scroll: false });

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { setCopied(false); }
  };

  // ─── Detail view ──────────────────────────────────────────────────────────
  if (selected) {
    const diff = DIFFICULTY[selected.difficulty];
    const relatedServices = selected.related
      ?.map(id => SERVICES.find(s => s.id === id))
      .filter(Boolean) || [];

    return (
      <main className="min-h-screen font-sans" style={{ background:'#e8e8e8' }}>
        <div className="mx-auto bg-white" style={{ maxWidth:1200 }}>
          <PortifyHeader serviceId="govfast" />
          <div className="px-8 py-8" style={{ maxWidth:760 }}>

            <button type="button" onClick={goBack}
              className="text-xs font-semibold mb-6 block bg-transparent border-none cursor-pointer p-0 hover:underline"
              style={{ color:'#0D5EAF' }}>
              ← Πίσω στις υπηρεσίες
            </button>

            <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
              <div style={{ fontSize:40 }}>{selected.icon}</div>
              <div>
                <div className="text-2xl font-black tracking-tight text-gray-900">{selected.name}</div>
                <div className="text-xs text-gray-400 mt-1">{CAT_LABELS[selected.cat]}</div>
              </div>
            </div>

            <div className="flex gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background:diff.bg, color:diff.color }}>
                {diff.dot} {diff.label}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                ⏱ {selected.time}
              </div>
              {selected.processingTime && (
                <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#fff8e8] text-[#8a6000]">
                  🗓 Διεκπεραίωση: {selected.processingTime}
                </div>
              )}
              <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${selected.cost?.amount === 0 ? 'bg-[#e8f7f0] text-[#1a6b4a]' : 'bg-[#fff8e8] text-[#8a6000]'}`}>
                💶 {selected.cost?.label || 'Δωρεάν'}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                📋 {selected.needs?.length || 0} απαιτήσεις
              </div>
            </div>

            {selected.prerequisites?.length > 0 && (
              <div className="rounded-xl p-4 mb-6 bg-[#fff8e8] border border-[#f5c842]">
                <div className="text-xs font-bold uppercase tracking-widest mb-3 text-[#8a6000]">
                  Χρειάζεσαι πρώτα
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.prerequisites.map(prereqId => {
                    const prereq = SERVICES.find(s => s.id === prereqId);
                    if (!prereq) return null;
                    return (
                      <button key={prereqId} type="button"
                        onClick={() => selectService(prereqId)}
                        className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#f5c842] bg-white text-[#8a6000] cursor-pointer hover:bg-[#fffbe8] transition-colors">
                        {prereq.icon} {prereq.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selected.needs?.length > 0 && (
              <div className="rounded-xl p-6 mb-6 bg-[#f0f6ff]">
                <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:'#0D5EAF' }}>
                  Πριν ξεκινήσεις, βεβαιώσου ότι έχεις:
                </div>
                {selected.needs.map((n,i) => (
                  <div key={i} className="flex items-center gap-3 mb-3 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:'#0D5EAF' }} />
                    {n}
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6 p-4 text-sm leading-relaxed rounded-r-xl bg-[#fffbe8]"
              style={{ borderLeft:'3px solid #f5c842', color:'#5a3c00' }}>
              💡 {selected.tip}
            </div>

            {selected.commonQuestions?.length > 0 && (
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">
                  Συχνές ερωτήσεις
                </div>
                <div className="flex flex-col gap-2">
                  {selected.commonQuestions.map((faq, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                      <span className="text-xs text-gray-500 flex-1">{faq.q}</span>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color:'#0D5EAF' }}>{faq.a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => window.open(selected.url, '_blank', 'noopener,noreferrer')}
              aria-label={`Πήγαινέ με στο gov.gr για ${selected.name}`}
              className="block w-full text-center font-bold text-sm text-white rounded-xl py-4 border-none cursor-pointer mb-3 hover:bg-[#0a4d9a] transition-colors"
              style={{ background:'#0D5EAF' }}>
              Πήγαινέ με στο gov.gr →
            </button>

            <button type="button" onClick={copyLink}
              className="w-full text-center text-xs font-semibold py-3 rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 bg-white cursor-pointer transition-colors mb-8">
              {copied ? '✓ Αντιγράφηκε!' : '🔗 Αντιγραφή link'}
            </button>

            {relatedServices.length > 0 && (
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-400">
                  Σχετικές υπηρεσίες
                </div>
                <div className="flex flex-col gap-2">
                  {relatedServices.map(s => (
                    <button key={s.id} type="button"
                      onClick={() => selectService(s.id)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#0D5EAF] text-left transition-colors cursor-pointer bg-white">
                      <span className="text-xl">{s.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.desc}</div>
                      </div>
                      <span className="text-xs font-semibold" style={{ color:'#0D5EAF' }}>→</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between px-8 py-5" style={{ background:'#111' }}>
            <span className="text-xs font-bold tracking-widest" style={{ color:'#ffffff40' }}>PORTIFY.GR</span>
            <span className="font-black tracking-tight" style={{ fontSize:16, color:'#fff' }}>
              Faster than <span style={{ color:'#f5c842' }}>search.</span>
            </span>
          </div>
        </div>
      </main>
    );
  }

  // ─── List view ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen font-sans" style={{ background:'#e8e8e8' }}>
      <div className="mx-auto bg-white" style={{ maxWidth:1200 }}>
        <PortifyHeader serviceId="govfast" />

        <div className="px-8 py-4 border-b border-gray-100 bg-[#f7f5f0]">
          <input type="text" value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (e.target.value) { lastActiveRef.current = active; setActive(''); }
              else setActive(lastActiveRef.current);
            }}
            placeholder="Τι θέλεις να κάνεις; π.χ. «βγάλω ΑΜΚΑ», «υπεύθυνη δήλωση»"
            aria-label="Αναζήτηση υπηρεσίας"
            className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm outline-none focus:border-blue-400 transition-colors"
          />
        </div>

        <div className="flex gap-2 px-8 py-4 border-b border-gray-100 flex-wrap">
          {FILTERS.map(f => (
            <button type="button" key={f.id}
              onClick={() => { setActive(f.id); setSearch(''); }}
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border cursor-pointer transition-colors"
              style={{
                background: active === f.id && !search ? '#0D5EAF' : '#fff',
                color: active === f.id && !search ? '#fff' : '#555',
                borderColor: active === f.id && !search ? '#0D5EAF' : '#ddd',
              }}>
              {f.label}
            </button>
          ))}
        </div>

        <div className="px-8 pt-5 pb-2">
          <div className="text-xs font-bold uppercase tracking-widest text-gray-300">{sectionTitle}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-8 pb-8 pt-3">
          {filtered.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <div className="text-gray-300 text-sm mb-2">Δεν βρέθηκαν υπηρεσίες</div>
              <div className="text-gray-300 text-xs">Δοκίμασε άλλη λέξη ή αρχικά (π.χ. ΑΜΚΑ, ΑΦΜ)</div>
            </div>
          ) : filtered.map(s => {
            const diff = DIFFICULTY[s.difficulty];
            return (
              <button type="button" key={s.id}
                onClick={() => selectService(s.id)}
                onKeyDown={e => e.key === 'Enter' && selectService(s.id)}
                tabIndex={0}
                className="group text-left bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-[#0D5EAF] hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0D5EAF] focus:ring-offset-2">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${CAT_BADGE[s.cat]}`}>
                    {CAT_LABELS[s.cat]}
                  </span>
                  <span className="text-lg transition-transform group-hover:scale-110">{s.icon}</span>
                </div>
                <div className="text-sm font-bold text-gray-900 mb-1 leading-snug">{s.name}</div>
                <div className="text-xs text-gray-400 leading-relaxed mb-3">{s.desc}</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background:diff.bg, color:diff.color }}>
                    {diff.dot} {diff.label}
                  </span>
                  <span className="text-xs text-gray-400">{s.time}</span>
                </div>
                <div className="text-xs font-semibold group-hover:underline" style={{ color:'#0D5EAF' }}>
                  Δες τι χρειάζεσαι →
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
          <span className="text-xs text-gray-300">Οι πληροφορίες είναι ενδεικτικές.</span>
        </div>

        <div className="flex items-center justify-between px-8 py-5" style={{ background:'#111' }}>
          <span className="text-xs font-bold tracking-widest" style={{ color:'#ffffff40' }}>PORTIFY.GR</span>
          <span className="font-black tracking-tight" style={{ fontSize:16, color:'#fff' }}>
            Faster than <span style={{ color:'#f5c842' }}>search.</span>
          </span>
        </div>
      </div>
    </main>
  );
}

export default function GovFastPage() {
  return (
    <Suspense fallback={<GovFastSkeleton />}>
      <GovFastPageInner />
    </Suspense>
  );
}