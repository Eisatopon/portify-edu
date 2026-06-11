'use client';
import PortifyHeader from "@/src/ui/components/PortifyHeader";
import { useState, useRef } from "react";
import { API_ROUTES } from "@/src/core/config/appConfig";

const MAX_PDF_SIZE = 10 * 1024 * 1024;
const ICONS = ['🎯', '🔑', '💡', '📝', '📌'];

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^#&?]{11})/,
    /youtube\.com\/shorts\/([^#&?]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

export default function VideoSummaryPage() {
  const [tab, setTab] = useState('video');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [duration, setDuration] = useState(null);
  const [pages, setPages] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  const reset = () => { setSummary(null); setError(null); setUrl(''); setFile(null); setDuration(null); setPages(null); if (fileRef.current) fileRef.current.value = ''; };

  const handleVideoSubmit = async () => {
    if (!url.trim()) return;
    const videoId = extractVideoId(url);
    if (!videoId) { setError('Άκυρο YouTube URL.'); return; }
    setLoading(true); setSummary(null); setError(null);
    try {
      const res = await fetch(API_ROUTES.videoSummary, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ url }) });
      if (!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      if (data.success) { setSummary(data.bullets); setDuration(data.duration||null); }
      else throw new Error(data.error||'Error');
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleFileChange = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Επίτρεπονται μόνο PDF.'); return; }
    if (f.size > MAX_PDF_SIZE) { setError('Μέγιστο 10MB.'); return; }
    setFile(f); setError(null);
  };

  const handlePdfSubmit = async () => {
    if (!file) return;
    setLoading(true); setSummary(null); setError(null);
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      const res = await fetch('/video-summary/api?type=pdf', { method:'POST', body:formData });
      if (!res.ok) throw new Error('HTTP '+res.status);
      const data = await res.json();
      if (data.success) { setSummary(data.bullets); setPages(data.pages||null); }
      else throw new Error(data.error||'Error');
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary.map((b,i)=>`${i+1}. ${b}`).join('\n'));
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  return (
    <main className="font-sans min-h-screen" style={{ background:'#e8e8e8' }}>
      <div className="mx-auto bg-white" style={{ maxWidth:1200 }}>
        <PortifyHeader serviceId="video-summary" />
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-px" style={{ background:'#e8e8e8' }}>
          <div className="bg-white p-6 md:p-10">
            <div className="flex gap-2 mb-6 border-b border-gray-100 pb-4">
              <button type="button" onClick={()=>{setTab('video');reset();}} className="text-sm font-bold px-4 py-2 rounded-lg cursor-pointer border-none" style={{ background:tab==='video'?'#e8380d':'#f7f5f0', color:tab==='video'?'#fff':'#555' }}>📹 YouTube Video</button>
              <button type="button" onClick={()=>{setTab('pdf');reset();}} className="text-sm font-bold px-4 py-2 rounded-lg cursor-pointer border-none" style={{ background:tab==='pdf'?'#e8380d':'#f7f5f0', color:tab==='pdf'?'#fff':'#555' }}>📄 PDF Έγγραφο</button>
            </div>
            {tab==='video' && (
              <>
                <p className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-4">Βάλε το link του βίντεο</p>
                <div className="flex flex-col sm:flex-row gap-3 mb-2">
                  <input type="url" value={url} onChange={e=>{setUrl(e.target.value);setError(null);}} onKeyDown={e=>e.key==='Enter'&&handleVideoSubmit()} placeholder="https://youtube.com/watch?v=..." disabled={loading} className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-4 px-5 text-sm outline-none focus:border-red-400" />
                  <button type="button" onClick={handleVideoSubmit} disabled={loading||!url.trim()} className="text-white font-bold rounded-lg py-4 px-8 text-sm border-none cursor-pointer disabled:opacity-50 bg-[#e8380d]">{loading?'Ανάλυση...':'Ουσία Τώρα →'}</button>
                </div>
                <p className="text-xs text-gray-300 mb-8">Δουλεύει μόνο με YouTube URLs.</p>
              </>
            )}
            {tab==='pdf' && (
              <>
                <p className="text-sm font-semibold tracking-wider uppercase text-gray-400 mb-4">Ανέβασε PDF έγγραφο</p>
                <div className={`border-2 border-dashed rounded-xl p-10 text-center mb-6 ${loading?'opacity-50 cursor-not-allowed border-gray-200':'cursor-pointer hover:border-red-300 border-gray-200'}`} onClick={()=>!loading&&fileRef.current?.click()} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(!loading)handleFileChange(e.dataTransfer.files[0]);}}>
                  <input ref={fileRef} type="file" accept=".pdf" className="hidden" disabled={loading} onChange={e=>handleFileChange(e.target.files[0])} />
                  {file ? (<><div className="text-3xl mb-2">📄</div><div className="text-sm font-bold text-gray-900">{file.name}</div><div className="text-xs text-gray-400 mt-1">{(file.size/1024/1024).toFixed(2)} MB</div></>) : (<><div className="text-3xl mb-2">📂</div><div className="text-sm text-gray-500">Σύρε PDF εδώ ή κλίκ</div><div className="text-xs text-gray-300 mt-1">Μέγιστο 10MB</div></>)}
                </div>
                <button type="button" onClick={handlePdfSubmit} disabled={loading||!file} className="w-full text-white font-bold rounded-lg py-4 px-8 text-sm border-none cursor-pointer disabled:opacity-50 bg-[#e8380d]">{loading?'Ανάλυση...':'Ουσία Τώρα →'}</button>
              </>
            )}
            {error && <div className="text-sm mb-5 mt-4" style={{ color:'#e8380d' }}>⚠️ {error}</div>}
            {loading && <div className="bg-gray-50 rounded-xl p-8 mt-4">{[90,75,60].map((w,i)=>(<div key={i} className="h-5 bg-gray-200 rounded mb-4 animate-pulse" style={{ width:`${w}%` }}/>))}</div>}
            {summary && !loading && (
              <div className="bg-gray-50 rounded-xl p-8 mt-4">
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-gray-200">
                  <span className="text-sm font-bold tracking-wider uppercase text-gray-400">Η ουσία σε 10 δευτερόλεπτα</span>
                  {duration && <span className="text-sm font-bold" style={{ color:'#1a6b4a' }}>Κέρδισες ~{duration} λεπτά!</span>}
                  {pages && !duration && <span className="text-sm font-bold" style={{ color:'#1a6b4a' }}>{pages} σελίδες</span>}
                </div>
                {summary.map((b,i)=>(<div key={i} className="flex gap-4 mb-6"><span className="text-2xl shrink-0 mt-0.5">{ICONS[i]||'•'}</span><span className="text-base text-gray-700 leading-relaxed">{b}</span></div>))}
                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-200">
                  <button type="button" onClick={handleCopy} className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 bg-white cursor-pointer">{copied?'✓ Αντιγράφηκε!':'📋 Αντιγραφή'}</button>
                  <button type="button" onClick={reset} className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-400 bg-white cursor-pointer">← Νέα ανάλυση</button>
                </div>
              </div>
            )}
            {!summary && !loading && !error && (
              <div className="bg-gray-50 rounded-xl p-12 text-center mt-4">
                <div className="text-4xl mb-4">{tab==='video'?'🎥':'📄'}</div>
                <p className="text-base text-gray-400">{tab==='video'?'Βάλε ένα YouTube link και δες την ουσία σε δευτερόλεπτα':'Ανέβασε ένα PDF και δες την ουσία σε δευτερόλεπτα'}</p>
              </div>
            )}
          </div>
          <div className="hidden lg:grid grid-rows-2 gap-px" style={{ background:'#e8e8e8' }}>
            <div className="flex flex-col items-center justify-center text-center gap-5 px-6 py-10" style={{ background:'#1a1a2e' }}>
              <span className="text-xs font-bold tracking-wider uppercase" style={{ color:'#ffffff50' }}>Εξοικονόμηση</span>
              <span className="font-black text-white leading-none" style={{ fontSize:72, letterSpacing:'-0.04em' }}>40'</span>
              <div className="font-bold text-white leading-snug" style={{ fontSize:18 }}>Λεπτά περιεχομένου.<br/><span style={{ color:'#a8b8f0' }}>3 παράγραφοι.</span></div>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-5 px-6 py-10" style={{ background:'#5a2d9e' }}>
              <span className="text-xs font-bold tracking-wider uppercase" style={{ color:'#ffffff50' }}>Powered by</span>
              <span className="font-black text-white leading-none" style={{ fontSize:72, letterSpacing:'-0.04em' }}>AI</span>
              <div className="font-bold text-white leading-snug" style={{ fontSize:18 }}>Αυτόματη<br/><span style={{ color:'#c8b0f0' }}>ανάλυση.</span></div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-8 py-5" style={{ background:'#111' }}>
          <span className="text-xs font-bold tracking-widest" style={{ color:'#ffffff40' }}>PORTIFY.GR</span>
          <span className="font-black tracking-tight" style={{ fontSize:16, color:'#fff' }}>Faster than <span style={{ color:'#f5c842' }}>search.</span></span>
        </div>
      </div>
    </main>
  );
}