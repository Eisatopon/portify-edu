const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Διαδρομή για την αποθήκευση των δεδομένων
const OUTPUT_PATH = path.join(__dirname, 'src', 'data', 'books.json');

// Στόχος: Η επίσημη σελίδα της Μελίσπης (π.χ. για τα νέα βιβλία)
const MULTI_BOOKS_URL = 'https://cti.gr'; 

async function startScraping() {
  try {
    console.log('🔄 Έναρξη αυτόματης συλλογής σχολικών βιβλίων...');
    
    // Κατεβάζουμε την HTML σελίδα
    const { data } = await axios.get(MULTI_BOOKS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    const scrapedBooks = [];

    // --- ΔΟΚΙΜΑΣΤΙΚΗ ΔΟΜΗ ΣΥΛΛΟΓΗΣ ---
    // Τοποθετούμε τα δύο βασικά δοκιμαστικά βιβλία ως βάση
    scrapedBooks.push(
      {
        id: "dim-g-istoria",
        level: "dimotiko",
        grade: "g-taxi",
        subject: "history",
        title: "Ιστορία Γ' Δημοτικού - Στα αρχαία χρόνια",
        version: "multiple",
        links: { pdf: "https://cti.gr" }
      },
      {
        id: "gym-a-math",
        level: "gymnasio",
        grade: "a-gym",
        subject: "math",
        title: "Μαθηματικά Α' Γυμνασίου",
        version: "classic",
        links: { pdf: "http://ebooks.edu.gr" }
      }
    );

    // Εδώ το script θα σκανάρει αυτόματα τα elements της σελίδας όταν εμπλουτιστεί το HTML API
    // Παράδειγμα αυτοματοποιημένης ροής:
    $('.book-card, .row').each((index, element) => {
       const titleText = $(element).find('.title, a').text().trim();
       const linkHref = $(element).find('a[href$=".pdf"]').attr('href');
       
       if (titleText && linkHref) {
         // Ανίχνευση βαθμίδας από το κείμενο
         let level = "gymnasio";
         if (titleText.includes("Δημοτικού")) level = "dimotiko";
         if (titleText.includes("Λυκείου")) level = "lykeio";

         scrapedBooks.push({
           id: `scraped-${index}`,
           level: level,
           grade: titleText.includes("Γ'") ? "g-taxi" : "a-gym",
           subject: titleText.includes("Ιστορία") ? "history" : "math",
           title: titleText,
           version: MULTI_BOOKS_URL.includes("cti.gr") ? "multiple" : "classic",
           links: {
             pdf: linkHref.startsWith('http') ? linkHref : `${MULTI_BOOKS_URL}${linkHref}`
           }
         });
       }
    });

    // Φιλτράρουμε για να μην έχουμε διπλότυπα εγγραφών
    const uniqueBooks = Array.from(new Set(scrapedBooks.map(b => b.id)))
      .map(id => scrapedBooks.find(b => b.id === id));

    // Γράφουμε τα δεδομένα απευθείας στο src/data/books.json
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(uniqueBooks, null, 2), 'utf-8');
    
    console.log(`\n✅ Επιτυχής ολοκλήρωση! Συλλέχθηκαν ${uniqueBooks.length} βιβλία.`);
    console.log(`📂 Τα δεδομένα αποθηκεύτηκαν στο: src/data/books.json`);

  } catch (error) {
    console.error('❌ Σφάλμα κατά τη διάρκεια του scraping:', error.message);
  }
}

startScraping();
