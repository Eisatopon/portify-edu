'use client';
import PortifyHeader from "@/src/ui/components/PortifyHeader";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SERVICES, CAT_LABELS, CAT_BADGE, FILTERS, DIFFICULTY } from "@/src/data/govfastServices";

function matchesSearch(s, q) {
  const lower = q.toLowerCase();
  return s.name.toLowerCase().includes(lower) || s.desc.toLowerCase().includes(lower);
}

function GovFastPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState('popular');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const serviceId = searchParams.get('service');
  const selected = serviceId ? SERVICES.find(s => s.id === serviceId) : null;

  useEffect(() => { if (serviceId) window.scrollTo(0, 0); }, [serviceId]);

  const filtered = SERVICES.filter(s =>
    search ? matchesSearch(s, search) :
    active === 'popular' ? s.popular : s.cat === active
  );

  const sectionTitle = search ? 'Αποτελέσματα αναζήτησης' : active === 'popular' ? 'Δημοφιλείς υπηρεσίες' : CAT_LABELS[active];
  const selectService = (id) => router.push(`/govfast?service=${id}`, { scroll: false });
  const goBack = () => router.push('/govfast', { scroll: false });
  const copyLink = async () => { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (selected) {
    const diff = DIFFICULTY[selected.difficulty];
    return (
      <main className="min-h-screen font-sans" style={{ background:'#e8e8e8' }}>
        <div className="mx-auto bg-white" style={{ maxWidth:1200 }}>
          <PortifyHeader serviceId="govfast" />
          <div className="px-8 py-6" style={{ maxWidth:720 }}>
            <button type="button" onClick={goBack} className="text-xs font-semibold mb-6 block bg-transparent border-none cursor-pointer p-0" style={{ color:'#0D5EAF' }}>← Πίσω στις υπηρεσίες</button>
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
              <div style={{ fontSize:32 }}>{selected.icon}</div>
              <div>
                <div className="text-xl font-black tracking-tight text-gray-900">{selected.name}</div>
                <div className="text-xs text-gray-400 mt-1">{CAT_LABELS[selected.cat]}</div>
              </div>
            </div>
            <div className="flex gap-3 mb-5">
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background:diff.bg, color:diff.color }}>{diff.dot} {diff.label}</div>
              <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">⏱ {selected.time}</div>
            </div>
            <div className="rounded-xl p-5 mb-5" style={{ background:'#f0f6ff' }}>
              <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color:'#0D5EAF' }}>Θα χρειαστείς</div>
              {selected.needs.map((n,i)=>(<div key={i} className="flex items-center gap-3 mb-3 text-sm text-gray-700"><div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:'#0D5EAF' }}/>{n}</div>))}
            </div>
            <div className="mb-5 p-4 text-sm leading-relaxed" style={{ background:'#fffbe8', borderLeft:'3px solid #f5c842', borderRadius:'0 8px 8px 0', color:'#5a3c00' }}>💡 {selected.tip}</div>
            <a href={selected.url} target="_blank" rel="noopener noreferrer" className="block text-center font-bold text-sm text-white rounded-xl py-4 no-underline mb-3" style={{ background:'#0D5EAF' }} onMouseEnter={e=>e.currentTarget.style.background='#0a4d9a'} onMouseLeave={e=>e.currentTarget.style.background='#0D5EAF'}>Πήγαινέ με στο gov.gr →</a>
            <button type="button" onClick={copyLink} className="w-full text-center text-xs font-semibold py-3 rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 bg-white cursor-pointer">{copied?'✓ Αντιγράφηκε!':'🔗 Αντιγραφή link'}</button>
          </div>
          <div className="flex items-center justify-between px-8 py-5" style={{ background:'#111' }}>
            <span className="text-xs font-bold tracking-widest" style={{ color:'#ffffff40' }}>PORTIFY.GR</span>
            <span className="font-black tracking-tight" style={{ fontSize:16, color:'#fff' }}>Faster than <span style={{ color:'#f5c842' }}>search.</span></span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen font-sans" style={{ background:'#e8e8e8' }}>
      <div className="mx-auto bg-white" style={{ maxWidth:1200 }}>
        <PortifyHeader serviceId="govfast" />
        <div className="px-8 py-4 border-b border-gray-100" style={{ background:'#f7f5f0' }}>
          <input type="text" value={search} onChange={e=>{setSearch(e.target.value);if(e.target.value)setActive('');}} placeholder="Αναζήτηση υπηρεσίας... π.χ. «ΑΜΚΑ»" aria-label="Αναζήτηση υπηρεσίας" className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm outline-none focus:border-blue-400" />
        </div>
        <div className="flex gap-2 px-8 py-4 border-b border-gray-100 flex-wrap">
          {FILTERS.map(f=>(
            <button type="button" key={f.id} onClick={()=>{setActive(f.id);setSearch('');}} className="text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full border cursor-pointer" style={{ background:active===f.id&&!search?'#0D5EAF':'#fff', color:active===f.id&&!search?'#fff':'#555', borderColor:active===f.id&&!search?'#0D5EAF':'#ddd' }}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="px-8 pt-5 pb-2"><div className="text-xs font-bold uppercase tracking-widest text-gray-300">{sectionTitle}</div></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-8 pb-8 pt-3">
          {filtered.length===0 ? (
            <div className="col-span-3 text-center py-12"><div className="text-gray-300 text-sm mb-2">Δεν βρέθηκαν υπηρεσίες</div></div>
          ) : filtered.map(s=>{
            const diff=DIFFICULTY[s.difficulty];
            return (
              <button type="button" key={s.id} onClick={()=>selectService(s.id)} className="text-left bg-white border border-gray-100 rounded-xl p-4 cursor-pointer hover:border-blue-300" style={{ outline:'none' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-block text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${CAT_BADGE[s.cat]}`}>{CAT_LABELS[s.cat]}</span>
                  <span className="text-lg">{s.icon}</span>
                </div>
                <div className="text-sm font-bold text-gray-900 mb-1 leading-snug">{s.name}</div>
                <div className="text-xs text-gray-400 leading-relaxed mb-3">{s.desc}</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background:diff.bg, color:diff.color }}>{diff.dot} {diff.label}</span>
                  <span className="text-xs text-gray-400">⏱ {s.time}</span>
                </div>
                <div className="text-xs font-semibold" style={{ color:'#0D5EAF' }}>Δες τι χρειάζεσαι →</div>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
          <span className="text-xs text-gray-300">Οι πληροφορίες είναι ενδεικτικές.</span>
        </div>
        <div className="flex items-center justify-between px-8 py-5" style={{ background:'#111' }}>
          <span className="text-xs font-bold tracking-widest" style={{ color:'#ffffff40' }}>PORTIFY.GR</span>
          <span className="font-black tracking-tight" style={{ fontSize:16, color:'#fff' }}>Faster than <span style={{ color:'#f5c842' }}>search.</span></span>
        </div>
      </div>
    </main>
  );
}

export default function GovFastPage() {
  return <Suspense><GovFastPageInner /></Suspense>;
}