// Usage: node scripts/codemods/remove-unused-currentUser.js src/screens/resident/CommunityScreen.js
const fs = require('fs');
const path = require('path');

const file = process.argv[2] || 'src/screens/resident/CommunityScreen.js';
const p = path.resolve(file);
if (!fs.existsSync(p)) {
  console.log(`[rm-unused-currentUser] skip (not found): ${file}`);
  process.exit(0);
}

let code = fs.readFileSync(p, 'utf8');

// 패턴 1: const { showToast, currentUser } = useAppContext();
code = code.replace(
  /const\s*\{\s*([^}]*?)\s*\}\s*=\s*useAppContext\(\);/g,
  (m, inside) => {
    // 속성들을 쉼표 기준으로 분리
    const props = inside.split(',').map(s => s.trim()).filter(Boolean);
    const filtered = props.filter(p => p !== 'currentUser');
    return `const { ${filtered.join(', ')} } = useAppContext();`;
  }
);

fs.writeFileSync(p, code, 'utf8');
console.log(`[rm-unused-currentUser] transformed: ${file}`);
