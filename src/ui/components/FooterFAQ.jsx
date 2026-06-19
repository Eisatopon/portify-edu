'use client';

import { useState } from 'react';

export default function FooterFAQ() {
  // Κρατάμε ποια ερώτηση είναι ανοιχτή (null = όλες κλειστές)
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "✨ Τι είναι το «Πολλαπλό Βιβλίο»;",
      answer: "Είναι η νέα εκπαιδευτική μεταρρύθμιση που επιτρέπει στους εκπαιδευτικούς να επιλέγουν το καταλληλότερο βιβλίο για την τάξη τους ανάμεσα σε περισσότερα από ένα εγκεκριμένα συγγράμματα για το ίδιο μάθημα, ξεφεύγοντας από τη στείρα αποστήθιση."
    },
    {
      question: "📱 Ποια είναι η διαφορά μεταξύ PDF και ePUB αρχείων;",
      answer: "Τα αρχεία PDF προσφέρουν την κλασική μορφή του τυπωμένου βιβλίου. Τα αρχεία ePUB είναι ειδικά σχεδιασμένα για κινητά και tablet, καθώς το κείμενο προσαρμόζεται αυτόματα στο μέγεθος της οθόνης σας για πιο ξεκούραστο διάβασμα."
    },
    {
      question: "🔍 Πώς λειτουργούν τα QR Codes στα έντυπα βιβλία;",
      answer: "Στα νέα έντυπα βιβλία υπάρχουν τυπωμένα QR codes. Σκανάροντάς τα με το κινητό ή το tablet σας, μεταφέρεστε αυτόματα στα Ψηφιακά Μαθησιακά Αντικείμενα (ΨΜΑ), όπως διαδραστικά παιχνίδια, βίντεο και προσομοιώσεις που εμπλουτίζουν το μάθημα."
    },
    {
      question: "🎒 Καλύπτουν όλα τα βιβλία την ίδια εξεταστέα ύλη;",
      answer: "Ναι, απόλυτα. Παρά τις διαφορές στη δομή, τις εικόνες ή τον τρόπο παρουσίασης, όλα τα εγκεκριμένα βιβλία του πολλαπλού θεσμού καλύπτουν ακριβώς την ίδια επίσημη εξεταστέα ύλη του Υπουργείου Παιδείας."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer className="w-full bg-[#0d1117] border-t border-[#21262d] mt-20 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-white mb-10 tracking-tight">
          Συχνές Ερωτήσεις & Χρήσιμοι Όροι
        </h2>

        {/* Λίστα Ερωτήσεων (Accordion) */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-gray-200 hover:text-amber-500 transition-colors gap-4"
              >
                <span>{faq.question}</span>
                <span className="text-amber-500 text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-5 text-sm text-gray-400 leading-relaxed border-t border-[#21262d] pt-4 bg-[#0d1117]/30">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Copyright & Credits */}
        <div className="text-center text-xs text-gray-500 border-t border-[#21262d]/50 pt-8">
          <p>© {new Date().getFullYear()} PORTIFY.GR — Faster than search. Με σεβασμό στην ανοιχτή εκπαίδευση.</p>
        </div>

      </div>
    </footer>
  );
}
