'use client';

import { useState } from 'react';
import booksData from '../../src/data/books.json';

export default function DimotikoPage() {
  // Φιλτράρουμε τη βάση ώστε να κρατήσουμε ΜΟΝΟ τα βιβλία του Δημοτικού
  const dimotikoBooks = booksData.filter(b => b.level === 'dimotiko');
  
  const [filteredBooks, setFilteredBooks] = useState(dimotikoBooks);
  const [selectedGrade, setSelectedGrade] = useState('all');

  // Φιλτράρισμα ανά τάξη του Δημοτικού
  const handleGradeChange = (grade) => {
    setSelectedGrade(grade);
    if (grade === 'all') {
      setFilteredBooks(dimotikoBooks);
    } else {
      setFilteredBooks(dimotikoBooks.filter(b => b.grade === grade));
    }
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Τίτλος Βαθμίδας */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center justify-center md:justify-start gap-2">
            🎒 Βιβλία Δημοτικού Σχολείου
          </h1>
          <p className="text-gray-400 text-sm">
            Άμεση πρόσβαση στα κλασικά και νέα πολλαπλά βιβλία του Δημοτικού.
          </p>
        </div>

        {/* Γρήγορα Φίλτρα Τάξεων (Στυλ Badges από το Eisatopon) */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
          <button 
            onClick={() => handleGradeChange('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
              selectedGrade === 'all' 
                ? 'bg-amber-500 text-slate-950 border-amber-500' 
                : 'bg-[#161b22] text-gray-400 border-[#30363d] hover:border-gray-500'
            }`}
          >
            Όλες οι Τάξεις
          </button>
          <button 
            onClick={() => handleGradeChange('g-taxi')}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
              selectedGrade === 'g-taxi' 
                ? 'bg-amber-500 text-slate-950 border-amber-500' 
                : 'bg-[#161b22] text-gray-400 border-[#30363d] hover:border-gray-500'
            }`}
          >
            Γ' Δημοτικού
          </button>
          {/* Μπορείτε να προσθέσετε περισσότερα κουμπιά τάξεων (α-taxi, b-taxi κλπ) όταν γεμίσει το JSON σας */}
        </div>

        {/* Grid Αποτελεσμάτων */}
        {filteredBooks.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Δεν έχουν αναρτηθεί ακόμα βιβλία για αυτή την επιλογή.</p>
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
                    <span className="text-xs text-gray-500 font-semibold uppercase">Δημοτικό</span>
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
    </div>
  );
}
