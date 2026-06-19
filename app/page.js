'use client';

import { useState } from 'react';
import booksData from '../src/data/books.json';
import FooterFAQ from '../src/ui/components/FooterFAQ';
export default function HomePage() {
  // States για τα φίλτρα
  const [level, setLevel] = useState('all');
  const [grade, setGrade] = useState('all');
  const [subject, setSubject] = useState('all');
  const [type, setType] = useState('all');
  
  // State για τα φιλτραρισμένα βιβλία που εμφανίζονται
  const [filteredBooks, setFilteredBooks] = useState(booksData);

  // Η συνάρτηση που εκτελείται instant όταν πατηθεί το Κίτρινο Κουμπί
  const handleSearch = () => {
    let results = booksData;

    if (level !== 'all') results = results.filter(b => b.level === level);
    if (grade !== 'all') results = results.filter(b => b.grade === grade);
    if (subject !== 'all') results = results.filter(b => b.subject === subject);
    if (type !== 'all') results = results.filter(b => b.version === type);

    setFilteredBooks(results);
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-gray-100 font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* 1. HERO SECTION (Στυλ Eisatopon) */}
      <div className="max-w-4xl mx-auto text-center pt-20 pb-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Ψηφιακή Πύλη Σχολικών Βιβλίων
        </h1>
        <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
          Κλασικά & Πολλαπλά βιβλία όλων των βαθμίδων σε μία πλατφόρμα. Faster than search.
        </p>

        {/* 4 Στατιστικά Κουτιά */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto bg-[#0d1117]/60 p-6 rounded-2xl border border-[#21262d] backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-bold text-amber-500">3</span>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1">Βαθμίδες</span>
          </div>
          <div className="flex flex-col border-l border-[#21262d]">
            <span className="text-2xl md:text-3xl font-bold text-amber-500">14</span>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1">Τάξεις</span>
          </div>
          <div className="flex flex-col border-l border-[#21262d]">
            <span className="text-2xl md:text-3xl font-bold text-amber-500">440+</span>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1">Βιβλία</span>
          </div>
          <div className="flex flex-col border-l border-[#21262d]">
            <span className="text-2xl md:text-3xl font-bold text-amber-500">2026</span>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1">Εφαρμογή</span>
          </div>
        </div>
      </div>

      {/* 2. ΜΠΑΡΑ ΦΙΛΤΡΩΝ (Στυλ Math Olympiad Bank) */}
      <div className="max-w-5xl mx-auto px-4 mb-16">
        <div className="bg-[#0d1117] border border-[#21262d] p-6 rounded-xl shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Dropdown 1: Βαθμίδα */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Βαθμίδα</label>
              <select 
                value={level} 
                onChange={(e) => { setLevel(e.target.value); setGrade('all'); }}
                className="w-full bg-[#161b22] text-gray-200 border border-[#30363d] rounded-lg px-4 py-3 outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="all">Όλες οι Βαθμίδες</option>
                <option value="dimotiko">🎒 Δημοτικό</option>
                <option value="gymnasio">📐 Γυμνάσιο</option>
                <option value="lykeio">🚀 Λύκειο</option>
              </select>
            </div>

            {/* Dropdown 2: Τάξη (Δυναμικό) */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Τάξη</label>
              <select 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-[#161b22] text-gray-200 border border-[#30363d] rounded-lg px-4 py-3 outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="all">Όλες οι Τάξεις</option>
                {level === 'dimotiko' && <option value="g-taxi">Γ' Δημοτικού</option>}
                {level === 'gymnasio' && <option value="a-gym">Α' Γυμνασίου</option>}
              </select>
            </div>

            {/* Dropdown 3: Μάθημα */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Μάθημα</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#161b22] text-gray-200 border border-[#30363d] rounded-lg px-4 py-3 outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="all">Όλα τα Μαθήματα</option>
                <option value="math">Μαθηματικά</option>
                <option value="history">Ιστορία</option>
              </select>
            </div>

            {/* Dropdown 4: Τύπος */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Τύπος Βιβλίου</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-[#161b22] text-gray-200 border border-[#30363d] rounded-lg px-4 py-3 outline-none focus:border-amber-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="all">Όλα τα βιβλία</option>
                <option value="classic">📚 Κλασικά (Διόφαντος)</option>
                <option value="multiple">✨ Πολλαπλά (Νέα)</option>
              </select>
            </div>

          </div>

          {/* Κίτρινο Κουμπί Αναζήτησης */}
          <div className="mt-6 flex justify-center">
            <button 
              onClick={handleSearch}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-amber-500/10 active:scale-95 transition-all cursor-pointer"
            >
              Browse Archive →
            </button>
          </div>
        </div>
      </div>

      {/* 3. ΕΜΦΑΝΙΣΗ ΑΠΟΤΕΛΕΣΜΑΤΩΝ (Βιβλία) */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        {filteredBooks.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Δεν βρέθηκαν βιβλία με αυτά τα κριτήρια.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <div key={book.id} className="bg-[#0d1117] border border-[#21262d] p-5 rounded-xl flex flex-col justify-between hover:border-[#30363d] transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      book.version === 'multiple' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {book.version === 'multiple' ? 'Πολλαπλό' : 'Κλασικό'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium uppercase">{book.level}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-400 capitalize mb-4">Μάθημα: {book.subject}</p>
                </div>
                
                <a 
                  href={book.links.pdf} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full text-center bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-gray-200 font-semibold py-2.5 rounded-lg text-sm transition-all"
                >
                  📖 Άμεσο Άνοιγμα PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    {/* Προσθήκη του FAQ Footer */}
<FooterFAQ />
 
    </div>
  );
}
