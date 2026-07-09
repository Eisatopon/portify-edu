import sys
from lxml import etree

path = sys.argv[1] if len(sys.argv) > 1 else "theme-original.xml"
with open(path, "r", encoding="utf-8") as f:
    data = f.read()

# Blogger uses macro:/mexpr: prefixes without declaring them. Inject decls so
# a strict XML parser can still check well-formedness / tag balance / entities.
inject = (
    "xmlns:macro='http://www.google.com/2005/gml/macro' "
    "xmlns:mexpr='http://www.google.com/2005/gml/mexpr' "
    "xmlns:'"  # placeholder, replaced below
)
# add missing namespace decls right after <html
needle = "xmlns:expr='http://www.google.com/2005/gml/expr'"
if needle in data:
    data = data.replace(
        needle,
        needle + " xmlns:macro='http://www.google.com/2005/gml/macro' xmlns:mexpr='http://www.google.com/2005/gml/mexpr'",
        1,
    )

try:
    parser = etree.XMLParser(resolve_entities=False, recover=False, huge_tree=True)
    etree.fromstring(data.encode("utf-8"), parser)
    print("OK: well-formed XML")
except etree.XMLSyntaxError as e:
    print("XML ERROR:")
    for err in parser.error_log:
        print(f"  line {err.line}, col {err.column}: {err.message}")
    sys.exit(1)
