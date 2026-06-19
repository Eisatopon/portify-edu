import './globals.css';
import PortifyHeader from '../src/ui/components/PortifyHeader';

export const metadata = {
  title: 'Portify.gr | Ψηφιακή Πύλη Σχολικών Βιβλίων',
  description: 'Κλασικά και πολλαπλά σχολικά βιβλία όλων των βαθμίδων σε μία πλατφόρμα αστραπιαίας ταχύτητας.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="el">
      <body className="bg-[#06090e] min-h-screen antialiased selection:bg-amber-500 selection:text-slate-900">
        {/* Το Navbar εμφανίζεται σταθερά στην κορυφή κάθε σελίδας */}
        <PortifyHeader />
        
        {/* Εδώ φορτώνει η εκάστοτε σελίδα */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
