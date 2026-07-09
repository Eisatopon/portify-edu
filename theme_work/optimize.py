import re

SRC = "theme-original.xml"
OUT = "theme-optimized.xml"

with open(SRC, "r", encoding="utf-8") as f:
    data = f.read()

changelog = []

# ---------------------------------------------------------------------------
# Restrict all <style> merging to the <head> region only (never touch widget
# CDATA styles further down the document).
# ---------------------------------------------------------------------------
head_end = data.index("</head>")
head = data[:head_end]
rest = data[head_end:]

style_re = re.compile(r"<style\b[^>]*>(.*?)</style>", re.DOTALL)
comment_re = re.compile(r"<!--.*?-->", re.DOTALL)

matches = list(style_re.finditer(head))

# Determine which gaps between consecutive style blocks contain ONLY whitespace
# and HTML comments (mergeable) vs. real content (boundary).
def gap_is_mergeable(text):
    stripped = comment_re.sub("", text)
    return stripped.strip() == ""

def clean_label(comment_html):
    # extract inner text of an HTML comment, tidy it into a CSS comment label
    inner = comment_html[4:-3]
    inner = inner.replace("&#9472;", "").replace("&#8212;", "-").replace("&#8594;", "->")
    inner = re.sub(r"=+", "", inner)
    inner = inner.replace("/*", "").replace("*/", "")
    inner = re.sub(r"\s+", " ", inner).strip()
    return inner

groups = []
current = [matches[0]] if matches else []
for prev, cur in zip(matches, matches[1:]):
    gap = head[prev.end():cur.start()]
    if gap_is_mergeable(gap):
        current.append(cur)
    else:
        groups.append(current)
        current = [cur]
if current:
    groups.append(current)

# Build new head by replacing each group's full span with one merged <style>.
new_head_parts = []
cursor = 0
merged_count = 0
dropped_empty = 0
for grp in groups:
    start = grp[0].start()
    end = grp[-1].end()
    new_head_parts.append(head[cursor:start])

    # collect css bodies + preceding comment labels within the group span
    css_chunks = []
    span_text = head[start:end]
    # walk through the group span capturing comment labels + style bodies in order
    pos = start
    for m in grp:
        gap = head[pos:m.start()]
        for c in comment_re.finditer(gap):
            lbl = clean_label(c.group(0))
            if lbl:
                css_chunks.append(("label", lbl))
        body = m.group(1).strip()
        if body:
            css_chunks.append(("css", body))
        pos = m.end()

    # nothing meaningful -> drop the whole group (empty/comment-only styles)
    real_css = [c for t, c in css_chunks if t == "css"]
    if not real_css:
        dropped_empty += len(grp)
        cursor = end
        continue

    if len(grp) > 1:
        merged_count += len(grp)

    lines = ["<style type='text/css'>"]
    for t, c in css_chunks:
        if t == "label":
            lines.append("/* " + c + " */")
        else:
            lines.append(c)
    lines.append("</style>")
    new_head_parts.append("\n".join(lines))
    cursor = end

new_head_parts.append(head[cursor:])
new_head = "".join(new_head_parts)

data = new_head + rest
changelog.append(f"CSS: merged {merged_count} <style> blocks into consolidated groups; dropped {dropped_empty} empty/comment-only style blocks.")

with open(OUT, "w", encoding="utf-8") as f:
    f.write(data)

print("Style tags in head BEFORE:", len(matches))
after = len(list(style_re.finditer(data[:data.index('</head>')])))
print("Style tags in head AFTER :", after)
for c in changelog:
    print(" -", c)
