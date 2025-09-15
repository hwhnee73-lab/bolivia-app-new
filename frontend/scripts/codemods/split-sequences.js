// Usage: node scripts/codemods/split-sequences.js src/screens/admin/AdminDashboard.js src/screens/admin/FinanceScreen.js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

const files = process.argv.slice(2);
if (files.length === 0) {
  console.log('[split-sequences] usage: node scripts/codemods/split-sequences.js <file...>');
  process.exit(0);
}

const parse = code =>
  parser.parse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'classProperties',
      'optionalChaining',
      'nullishCoalescingOperator',
      'objectRestSpread',
      'topLevelAwait'
    ]
  });

for (const f of files) {
  const p = path.resolve(f);
  if (!fs.existsSync(p)) {
    console.log(`[split-sequences] skip (not found): ${f}`);
    continue;
  }
  const src = fs.readFileSync(p, 'utf8');
  const ast = parse(src);
  let changed = false;

  traverse(ast, {
    ExpressionStatement(path) {
      const expr = path.node.expression;
      if (expr && expr.type === 'SequenceExpression') {
        // a, b, c;  →  a; b; c;
        const stmts = expr.expressions.map(e => ({
          type: 'ExpressionStatement',
          expression: e
        }));
        path.replaceWithMultiple(stmts);
        changed = true;
      }
    }
  });

  if (changed) {
    const out = generate(ast, { retainLines: true }, src).code;
    fs.writeFileSync(p, out, 'utf8');
    console.log(`[split-sequences] transformed: ${f}`);
  } else {
    console.log(`[split-sequences] no changes: ${f}`);
  }
}
