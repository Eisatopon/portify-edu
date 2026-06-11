'use client';
import PortifyHeader from "@/src/ui/components/PortifyHeader";
import { useNews } from "./hooks/useNews";
import { RSS_SOURCES } from "./services/rssFeeds";
import { POLLING } from "@/src/core/config/appConfig";

const CATEGORY_COLOR = {
  news:'#e8380d',politics:'#1a4fa8',sports:'#f5c842',economy:'#1a6b4a',tech:'#5a2d9e',
};
function getFavicon(link) {
  try { return `https://icons.duckduckgo.com/ip3/${new URL(link).hostname}.ico`; } catch { return null; }
}

export default function MolisToraPage() {
  const { news, loading, refetch } = useNews(POLLING.news);
  const featured = news[0] ?? null;
  const rest = news.slice(1, 7);
  return (
    <main className="min-h-screen font-sans" style={{ background:"#e8e8e8" }}>
      <div className="mx-auto bg-white" style={{ maxWidth:1200 }}>
        <PortifyHeader serviceId="molis-tora" />
        <div className="flex justify-end px-8 py-3 border-b border-gray-100">
          <button onClick={refetch} className="text-gray-300 hover:text-gray-600 transition-colors duration-150 bg-transparent border-none cursor-pointer text-lg" title="Ανανέωση">↻</button>
        </div>
        <div className="grid gap-px" style={{ gridTemplateColumns:"2fr 1fr", background:"#e8e8e8" }}>
          <div className="grid gap-px" style={{ gridTemplateColumns:"1fr 1fr", background:"#e8e8e8" }}>
            {loading ? <div className="col-span-2 min-h-[220px] p-6" style={{ background:"#1a4fa8" }} /> : featured ? (
              <a href={featured.link} target="_blank" rel="noopener noreferrer" className="col-span-2 min-h-[220px] p-6 no-underline flex flex-col justify-between" style={{ background:"#1a4fa8" }} onMouseEnter={e=>e.currentTarget.style.background="#1844a0"} onMouseLeave={e=>e.currentTarget.style.background="#1a4fa8"}>
                <div className="flex items-center gap-1.5">
                  <img src={getFavicon(featured.link)} alt="" className="w-3.5 h-3.5 rounded-sm" onError={e=>e.target.style.display='none'} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color:"#ffffff70" }}>{featured.source}</span>
                </div>
                <div>
                  <p className="font-bold text-white leading-snug tracking-tight mb-2" style={{ fontSize:24 }}>{featured.title}</p>
                  {featured.summary && <p className="text-sm leading-relaxed mb-2.5" style={{ color:"#ffffff80" }}>{featured.summary}</p>}
                  <span className="text-xs" style={{ color:"#ffffff40" }}>{featured.timeAgo}</span>
                </div>
              </a>
            ) : null}
            {loading ? [1,2,3,4,5,6].map(i=>(
              <div key={i} className="bg-white p-5 min-h-[180px]">
                <div className="h-3 bg-gray-100 rounded w-2/5 mb-3"/><div className="h-3.5 bg-gray-100 rounded w-11/12 mb-2"/><div className="h-3.5 bg-gray-100 rounded w-3/4"/>
              </div>
            )) : rest.map((item,i)=>(
              <a key={item.id||i} href={item.link} target="_blank" rel="noopener noreferrer" className="p-5 min-h-[180px] no-underline flex flex-col justify-between" style={{ background:"#fff" }} onMouseEnter={e=>e.currentTarget.style.background="#fafafa"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <img src={getFavicon(item.link)} alt="" className="w-3.5 h-3.5 rounded-sm" onError={e=>e.target.style.display='none'} />
                    <span className="text-xs font-semibold uppercase tracking-widest text-gray-300">{item.source}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full" style={{ background:CATEGORY_COLOR[item.category]??"#ccc" }}/>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 leading-snug tracking-tight mb-1.5" style={{ fontSize:16 }}>{item.title}</p>
                  {item.summary && <p className="text-sm text-gray-400 leading-relaxed">{item.summary}</p>}
                </div>
                <span className="text-xs text-gray-200 font-medium mt-2.5 block">{item.timeAgo}</span>
              </a>
            ))}
          </div>
          <div className="grid gap-px" style={{ gridTemplateRows:"1fr 1fr", background:"#e8e8e8" }}>
            <div className="flex flex-col items-center justify-center text-center gap-3 px-6 py-10" style={{ background:"#e8380d" }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color:"#ffffff50" }}>Ενημέρωση κάθε</span>
              <span className="font-black leading-none" style={{ fontSize:72, color:"#fff", letterSpacing:"-0.04em" }}>30"</span>
              <div className="font-bold leading-snug" style={{ fontSize:18, color:"#fff" }}>Πιο γρήγορα<br/><span style={{ color:"#ffd4c4" }}>από την είδηση.</span></div>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-3 px-6 py-10" style={{ background:"#1a6b4a" }}>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color:"#ffffff50" }}>Πηγές ειδήσεων</span>
              <span className="font-black leading-none" style={{ fontSize:72, color:"#fff", letterSpacing:"-0.04em" }}>{RSS_SOURCES.length}</span>
              <div className="font-bold leading-snug" style={{ fontSize:18, color:"#fff" }}>{RSS_SOURCES.length} πηγές.<br/><span style={{ color:"#a8d5be" }}>1 portal.</span></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-7 py-5" style={{ background:"#111" }}>
          <span className="text-xs font-bold tracking-widest" style={{ color:"#ffffff40" }}>PORTIFY.GR</span>
          <span className="font-black tracking-tight" style={{ fontSize:16, color:"#fff" }}>Faster than <span style={{ color:"#f5c842" }}>search.</span></span>
        </div>
      </div>
    </main>
  );
}