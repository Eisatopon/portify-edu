f = open(r'C:\portify-edu\src\components\BookCard.jsx', encoding='utf-8')
content = f.read()
f.close()
content = content.replace("if (isMobile) window.open(book.pdfUrl, '_blank');", "")
content = content.replace("else setShowViewer(true);", "setShowViewer(true);")
old = "${book.pdfUrl}#toolbar=1&view=FitH"
new = "/api/pdf?url=" + ""
content = content.replace(old, new)
f = open(r'C:\portify-edu\src\components\BookCard.jsx', 'w', encoding='utf-8')
f.write(content)
f.close()
print('OK')
