const fs = require('fs');
const path = require('path');

const file = process.argv[2] || 'src/components/layout/SlideOutMenu.js';
const p = path.resolve(file);
if (!fs.existsSync(p)) {
  console.log(`[anchor→button] skip (not found): ${file}`);
  process.exit(0);
}

let code = fs.readFileSync(p, 'utf8');

// 1) </a> → </button>
code = code.replace(/<\/a>/g, '</button>');

// 2) <a ... href="#" ...> → <button ... type="button" ...>
//   - href="#" 속성 제거
code = code.replace(
  /<a([^>]*?)\s+href\s*=\s*["']#["']([^>]*)>/g,
  (m, g1, g2) => `<button${g1}${g2} type="button">`
);

// 3) href="#" 단독 속성이 남아있다면 제거 (이중안전)
code = code.replace(/\s+href\s*=\s*["']#["']/g, '');

// 4) onClick 핸들러에서 e.preventDefault() 제거 및 매개변수 e 제거
code = code
  // 형태: onClick={(e) => { e.preventDefault(); ... }}
  .replace(/onClick=\{\(\s*e\s*\)\s*=>\s*\{\s*e\.preventDefault\(\);\s*/g, 'onClick={() => { ')
  // 형태: onClick={(e) => navigateTo(...)}
  .replace(/onClick=\{\(\s*e\s*\)\s*=>\s*/g, 'onClick={');

// 5) <button ...>에 type="button" 없으면 추가
code = code.replace(/<button(?![^>]*\btype=)/g, '<button type="button"');

fs.writeFileSync(p, code, 'utf8');
console.log(`[anchor→button] transformed: ${file}`);