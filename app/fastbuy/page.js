'use client';
import PortifyHeader from "@/src/ui/components/PortifyHeader";
import { useState } from "react";

const SUGGESTIONS = [
  { label:'💻 Laptop φοιτητή ~800€', query:'Laptop για φοιτητή μέχρι 800€' },
  { label:'📱 Κινητό με κάμερα ~400€', query:'Κινητό με καλή κάμερα μέχρι 400€' },
  { label:'🍳 Air fryer 4 άτομα', query:'Air fryer για 4 άτομα' },
  { label:'🍎 MacBook για προγραμματισμό', query:'MacBook για προγραμματισμό' },
  { label:'⌚ Smartwatch ~200€', query:'Smartwatch μέχρι 200€' },
  { label:'🎧 Ακουστικά ANC', query:'Ακουστικά με noise cancelling' },
];
const TIER_CONFIG = {
  best:    { label:'🥇 Καλύτερη Επιλογή', bg:'#f0ebff', color:'#5a2d9e', border:'#5a2d9e', borderWidth:2 },
  value:   { label:'💚 Value for Money',   bg:'#e8f7f0', color:'#1a6b4a', border:'#1a6b4a', borderWidth:2 },
  premium: { label:'⭐ Premium',           bg:'#fff8e8', color:'#8a6000', border:'#e8e8e8', borderWidth:1 },
};
const STORES = [
  { name:'Skroutz',   url:(q)=>`https://www.skroutz.gr/search?keyphrase=${encodeURIComponent(q)}`,   color:'#ff6600' },
  { name:'BestPrice', url:(q)=>`https://www.bestprice.gr/search?q=${encodeURIComponent(q)}`,         color:'#0066cc' },
  { name:'Amazon',    url:(q)=>`https://www.amazon.de/s?k=${encodeURIComponent(q)}`,                 color:'#ff9900' },
];

function PriceModal({ item, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }} onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:16, padding:28, maxWidth:360, width:'100%' }} onClick={e=>e.stopPropagation()}>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Σύγκρινε τιμές για</div>
        <div className="text-lg font-black text-gray-900 mb-6 leading-tight">{item.name}</div>
        <div className="flex flex-col gap-3">
          {STORES.map(store=>(
            <a key={store.name} href={store.url(item.name)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 no-underline hover:border-gray-400">
              <span className="font-bold text-sm text-gray-900">{store.name}</span>
              <span className="text-xs text-gray-400">Δες τιμή →</span>
            </a>
          ))}
        </div>
        <button type="button" onClick={onClose} className="w-full mt-4 text-xs text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer py-2">Κλείσιμο</button>
      </div>
    </div>
  );
}

export default function FastBuyPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (q) => {
    const searchQuery = q||query;
    if (!searchQuery.trim()) return;
    setQuery(searchQuery); setLoading(true); setResults(null); setError(null);
    try {
      const res = await fetch('/fastbuy/api', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ query:searchQuery }) });
      const data = await res.json();
      if (data.success) setResults(data.results?.length?data.results:[]);
      else setError(data.error||'Πρόβλημα με την υπηρεσία.');
    } catch { setError('Πρόβλημα σύνδεσης.'); }
    finally { setLoading(false); }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`FastBuy: "${query}" — portify.gr/fastbuy`);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  const displayQuery = query.length>60?query.slice(0,60)+'…':query;

  return (
    <main className="min-h-screen font-sans" style={{ background:'#e8e8e8' }}>
      <div className="mx-auto bg-white" style={{ maxWidth:1200 }}>
        <PortifyHeader serviceId="fastbuy" />
        <div className="px-6 md:px-8 py-5 border-b border-gray-100" style={{ background:'#f7f5f0' }}>
          <div className="flex gap-3 mb-4">
            <input type="text" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleSearch()} placeholder="π.χ. Laptop για φοιτητή μέχρι 800€" className="flex-1 bg-white border border-gray-200 rounded-lg py-3 px-4 text-sm outline-none focus:border-purple-400" />
            <button type="button" onClick={()=>handleSearch()} disabled={loading||!query.trim()} className="text-white font-bold text-sm rounded-lg px-6 py-3 border-none cursor-pointer disabled:opacity-50 bg-[#5a2d9e]">{loading?'Αναλύω...':'Βρες →'}</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {SUGGESTIONS.map((s,i)=>(
              <button type="button" key={i} onClick={()=>handleSearch(s.query)} className="text-sm bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-600 font-medium hover:text-purple-700 hover:border-purple-300 cursor-pointer">{s.label}</button>
            ))}
          </div>
        </div>
        <div className="px-6 md:px-8 py-8">
          {!loading && results===null && !error && (
            <div className="text-center py-16"><div className="text-5xl mb-4">🛒</div><p className="text-gray-500 text-base">Γράψε τι ψάχνεις και ο AI θα σου προτείνει τις καλύτερες επιλογές</p></div>
          )}
          {loading && <div className="flex flex-col gap-3">{[1,2,3].map(i=>(<div key={i} className="rounded-xl border border-gray-100 p-5"><div className="h-4 bg-gray-100 rounded w-32 mb-3 animate-pulse"/><div className="h-5 bg-gray-100 rounded w-48 mb-2 animate-pulse"/><div className="h-4 bg-gray-100 rounded w-full animate-pulse"/></div>))}</div>}
          {error && <div className="text-center py-12 text-sm" style={{ color:'#e8380d' }}>⚠️ {error}</div>}
          {results!==null && !loading && results.length===0 && (
            <div className="text-center py-12"><div className="text-4xl mb-3">🤔</div><div className="text-sm text-gray-500">Δεν βρέθηκαν προτάσεις.</div></div>
          )}
          {results!==null && !loading && results.length>0 && (
            <>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-5">Προτάσεις για "{displayQuery}"</div>
              <div className="flex flex-col gap-4">
                {results.map((item,i)=>{
                  const tier=TIER_CONFIG[item.tier]||TIER_CONFIG.premium;
                  return (
                    <div key={i} className="rounded-xl p-5" style={{ border:`${tier.borderWidth}px solid ${tier.border}` }}>
                      <div className="inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3" style={{ background:tier.bg, color:tier.color }}>{tier.label}</div>
                      <div className="text-lg font-black tracking-tight text-gray-900 mb-2">{item.name}</div>
                      <div className="text-sm text-gray-500 leading-relaxed mb-4">{item.reason}</div>
                      <div className="flex flex-wrap gap-2 mb-3">{item.pros?.slice(0,6).map((pro,j)=>(<span key={j} className="text-xs bg-gray-50 text-gray-500 px-3 py-1 rounded-full">✓ {pro}</span>))}</div>
                      {item.cons?.length>0 && <div className="flex flex-wrap gap-2 mb-3">{item.cons.slice(0,3).map((con,j)=>(<span key={j} className="text-xs bg-red-50 text-red-400 px-3 py-1 rounded-full">✗ {con}</span>))}</div>}
                      <div className="flex items-center justify-between">
                        <div><div className="text-2xl font-black text-gray-900 tracking-tight">~{item.price}€</div><div className="text-xs text-gray-300">ενδεικτική τιμή</div></div>
                        <button type="button" onClick={()=>setModalItem(item)} className="text-xs font-bold px-4 py-2 rounded-lg border cursor-pointer bg-white hover:bg-[#5a2d9e] hover:text-white hover:border-[#5a2d9e]" style={{ color:'#5a2d9e', borderColor:'#5a2d9e' }}>Βρες τιμή →</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-6 justify-center">
                <button type="button" onClick={handleShare} className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 bg-white cursor-pointer">{copied?'✓ Αντιγράφηκε!':'🔗 Μοιράσου'}</button>
                <button type="button" onClick={()=>{setResults(null);setQuery('');setError(null);}} className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 bg-white cursor-pointer">← Νέα αναζήτηση</button>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center justify-between px-8 py-5" style={{ background:'#111' }}>
          <span className="text-xs font-bold tracking-widest" style={{ color:'#ffffff40' }}>PORTIFY.GR</span>
          <span className="font-black tracking-tight" style={{ fontSize:16, color:'#fff' }}>Faster than <span style={{ color:'#f5c842' }}>search.</span></span>
        </div>
      </div>
      {modalItem && <PriceModal item={modalItem} onClose={()=>setModalItem(null)} />}
    </main>
  );
}