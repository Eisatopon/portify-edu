#!/usr/bin/env python3
"""
Melispi ePUB Fetcher - ID Guessing Pattern
Δοκιμάζει διαδοχικά IDs για να βρει το ePUB.

ΠΡΟΑΠΑΙΤΟΥΜΕΝΑ:
  pip install playwright beautifulsoup4
  python -m playwright install chromium

ΧΡΗΣΗ:
  python fetch_epub_guess.py
"""

import json
import re
import time
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

BOOKS_PATH = './books.json'
OUTPUT_PATH = './books_with_epub.json'
DEBUG_DIR = Path('./debug_guess')
DEBUG_DIR.mkdir(exist_ok=True)

MELISPI_BASE = 'https://ebooksdl.cti.gr'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
}


def extract_item_id(pdf_url):
    """Βγάζει το αριθμητικό ID από το PDF URL.

    Π.χ. .../20.500.14040/21385/1/... -> 21385
    """
    match = re.search(r'20\.500\.14040/(\d+)', pdf_url)
    return int(match.group(1)) if match else None


def build_view_url(item_id):
    """Φτιάχνει το view URL για ένα item ID."""
    return f"{MELISPI_BASE}/view?item=20.500.14040/{item_id}"


def build_bitstream_url(item_id, filename):
    """Φτιάχνει το bitstream URL για ένα item ID."""
    return f"{MELISPI_BASE}/bitstream/20.500.14040/{item_id}/1/{filename}"


def check_if_epub(page, item_id):
    """Ελέγχει αν ένα item ID είναι ePUB.

    Επιστρέφει: (is_epub, epub_url, debug_info)
    """
    view_url = build_view_url(item_id)

    try:
        page.goto(view_url, wait_until='networkidle', timeout=15000)
        time.sleep(2)

        html = page.content()
        title = page.title()

        # Ελέγχουμε αν είναι 404
        if '404' in title or 'Not Found' in title:
            return False, None, f"404 - {title}"

        # Ελέγχουμε αν λέει "ePUB" ή "epub" στη σελίδα
        html_lower = html.lower()
        page_text = BeautifulSoup(html, 'html.parser').get_text().lower()

        is_epub = ('epub' in html_lower or 'epub' in page_text or 
                   '.epub' in html_lower)

        # Ψάχνουμε για bitstream URL
        epub_url = None
        if is_epub:
            # Pattern 1: bitstream URL με .epub
            matches = re.findall(
                r'https?://ebooksdl\.cti\.gr/bitstream/[^"\'<>\s]+\.epub',
                html
            )
            if matches:
                epub_url = matches[0]
            else:
                # Pattern 2: bitstream URL χωρίς .epub αλλά με item ID
                matches = re.findall(
                    r'https?://ebooksdl\.cti\.gr/bitstream/20\.500\.14040/' + 
                    str(item_id) + r'/[^"\'<>\s]+',
                    html
                )
                if matches:
                    epub_url = matches[0]

        debug_info = f"title='{title}', epub={is_epub}"
        return is_epub, epub_url, debug_info

    except Exception as e:
        return False, None, f"Error: {e}"


def find_epub_for_book(page, book, index, total):
    """Ψάχνει το ePUB για ένα βιβλίο δοκιμάζοντας διαδοχικά IDs."""
    pdf_url = book.get('pdfUrl')
    if not pdf_url:
        print(f"  [{index}/{total}] No pdfUrl")
        return None

    pdf_id = extract_item_id(pdf_url)
    if not pdf_id:
        print(f"  [{index}/{total}] Cannot extract ID from: {pdf_url}")
        return None

    print(f"\n{'='*60}")
    print(f"  [{index}/{total}] {book.get('title', 'Unknown')[:50]}")
    print(f"  PDF ID: {pdf_id}")
    print(f"{'='*60}")

    # Στρατηγική: Δοκιμάζουμε IDs γύρω από το PDF ID
    # Πιθανά patterns: -1, -2, -3, +1, +2, +3
    offsets_to_try = [-3, -2, -1, 1, 2, 3, -4, -5, 4, 5]

    for offset in offsets_to_try:
        test_id = pdf_id + offset
        print(f"\n  Trying ID: {test_id} (offset {offset:+d})")

        is_epub, epub_url, debug = check_if_epub(page, test_id)
        print(f"  Result: {debug}")

        if is_epub:
            print(f"  ✅ ePUB FOUND!")
            if epub_url:
                print(f"  URL: {epub_url}")
                return {
                    'epubUrl': epub_url,
                    'epubItemId': test_id,
                    'pdfItemId': pdf_id,
                    'offset': offset
                }
            else:
                # Βρήκαμε ότι είναι ePUB αλλά δεν πήραμε URL
                # Φτιάχνουμε το URL με βάση το filename του PDF
                pdf_filename = pdf_url.split('/')[-1]
                epub_filename = pdf_filename.replace('.pdf', '.epub')
                guessed_url = build_bitstream_url(test_id, epub_filename)
                print(f"  Guessed URL: {guessed_url}")
                return {
                    'epubUrl': guessed_url,
                    'epubItemId': test_id,
                    'pdfItemId': pdf_id,
                    'offset': offset,
                    'guessed': True
                }

    print(f"\n  ❌ ePUB not found with any offset")
    return None


def main():
    print("=" * 70)
    print("  Melispi ePUB Fetcher - ID Guessing Pattern")
    print("=" * 70)
    print()

    books_path = Path(BOOKS_PATH)
    if not books_path.exists():
        print(f"Error: {BOOKS_PATH} not found")
        sys.exit(1)

    with open(books_path, 'r', encoding='utf-8') as f:
        books = json.load(f)

    print(f"Loaded {len(books)} books")

    books_to_process = [b for b in books if not b.get('epubUrl')]
    print(f"Need ePUB: {len(books_to_process)}")
    print()

    if not books_to_process:
        print("All books already have ePUB URLs!")
        return

    print("How many books to process?")
    print("  - Press Enter for ALL")
    print("  - Or type a number (e.g. 3 for testing)")
    response = input("> ").strip()

    if response:
        limit = int(response)
        books_to_process = books_to_process[:limit]
        print(f"Test mode: {limit} books")
    else:
        print(f"Full mode: {len(books_to_process)} books")

    print()
    print("Starting browser...")
    print()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        )
        page = context.new_page()

        found = 0
        not_found = 0

        for i, book in enumerate(books_to_process, 1):
            result = find_epub_for_book(page, book, i, len(books_to_process))

            if result:
                book['epubUrl'] = result['epubUrl']
                book['epubItemId'] = result['epubItemId']
                book['pdfItemId'] = result['pdfItemId']
                book['idOffset'] = result['offset']
                if result.get('guessed'):
                    book['epubUrlGuessed'] = True
                found += 1
            else:
                not_found += 1

            # Αποθήκευση κάθε 5
            if i % 5 == 0:
                with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
                    json.dump(books, f, ensure_ascii=False, indent=2)
                print(f"\n  Progress saved ({i}/{len(books_to_process)})")

            time.sleep(1)

        # Τελική αποθήκευση
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(books, f, ensure_ascii=False, indent=2)

        browser.close()

    print()
    print("=" * 70)
    print("  RESULTS")
    print("=" * 70)
    print(f"  ePUB found:     {found}")
    print(f"  ePUB not found: {not_found}")
    print(f"  Saved to:       {OUTPUT_PATH}")
    print()
    print("  If this worked, check the 'idOffset' field in the output.")
    print("  If most books have the same offset, we can optimize!")


if __name__ == '__main__':
    main()
