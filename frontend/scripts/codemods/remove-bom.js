// Usage: node scripts/codemods/remove-bom.js src/constants.js
const fs = require('fs');
const path = require('path');

const file = process.argv[2] || 'src/constants.js';
const p = path.resolve(file);

if (!fs.existsSync(p)) {
  console.log(`[remove-bom] skip (not found): ${file}`);
  process.exit(0);
}

let buf = fs.readFileSync(p);
const BOM = Buffer.from([0xEF, 0xBB, 0xBF]);

if (buf.slice(0, 3).equals(BOM)) {
  buf = buf.slice(3);
  fs.writeFileSync(p, buf);
  console.log(`[remove-bom] removed: ${file}`);
} else {
  console.log(`[remove-bom] no bom: ${file}`);
}