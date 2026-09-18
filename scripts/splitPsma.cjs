// scripts/splitPsma.cjs
// One-off/regeneratable build step: splits the monolithic src/data/psma.json
// (keyed by bitstream id) into one small JSON file per id under
// src/data/psma-shards/<id>.json.
//
// Why: app/api/ai-chat/route.js only ever needs the ΨΜΑ list for ONE book
// per request. Statically importing the full 4.5MB psma.json meant every
// invocation of that Node.js serverless function parsed/held the entire
// dataset in memory. Reading the per-book shard from disk at request time
// keeps the function's working set to a few KB instead.
//
// Run again whenever src/data/psma.json is regenerated:
//   node scripts/splitPsma.cjs

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src', 'data', 'psma.json');
const OUT_DIR = path.join(__dirname, '..', 'src', 'data', 'psma-shards');

const data = JSON.parse(fs.readFileSync(SRC, 'utf8'));

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

let count = 0;
for (const [id, items] of Object.entries(data)) {
  if (!/^\d+$/.test(id)) continue; // safety: only numeric bitstream ids
  fs.writeFileSync(path.join(OUT_DIR, `${id}.json`), JSON.stringify(items));
  count++;
}

console.log(`Wrote ${count} shard files to ${path.relative(process.cwd(), OUT_DIR)}`);
