import Link from 'next/link';

export default function PortifyHeader() {
  return (
    <header className="w-full bg-[#0d1117] border-b border-[#21262d] sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO: Επιστροφή στην Αρχική */}
        <Link href="/" className="text-xl font-bold tracking-wider text-white hover:text-amber-500 transition-colors">
          PORTIFY<span className="text-amber-500">.GR</span>
        </Link>

        {/* NAVIGATION LINKS: Οι 3 Σχολικές Βαθμίδες */}
        <nav className="flex items-center gap-1 md:gap-4">
          <Link href="/dimotiko" className="text-xs md:text-sm font-semibold text-gray-300 hover:text-amber-500 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded-lg transition-all">
            🎒 Δημοτικό
          </Link>
          <Link href="/gymnasio" className="text-xs md:text-sm font-semibold text-gray-300 hover:text-amber-500 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded-lg transition-all">
            📐 Γυμνάσιο
          </Link>
          <Link href="/lykeio" className="text-xs md:text-sm font-semibold text-gray-300 hover:text-amber-500 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded-lg transition-all">
            🚀 Λύκειο
          </Link>
        </nav>

      </div>
    </header>
  );
}
