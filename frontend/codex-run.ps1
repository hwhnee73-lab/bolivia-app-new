param(
  [string]$Root = "."
)

Set-Location $Root

Write-Host "== Lint Baseline =="
npx eslint --ext .js,.jsx src --format json -o scripts/reports/lint-report.before.json

Write-Host "== Fix: BOM =="
node scripts/codemods/remove-bom.js src/constants.js

Write-Host "== Fix: A11y anchor->button (SlideOutMenu) =="
node scripts/codemods/anchor-to-button-slideoutmenu.js src/components/layout/SlideOutMenu.js

Write-Host "== Fix: Unused currentUser (CommunityScreen) =="
node scripts/codemods/remove-unused-currentUser.js src/screens/resident/CommunityScreen.js

Write-Host "== Fix: Comma operator split (AdminDashboard, FinanceScreen) =="
node scripts/codemods/split-sequences.js src/screens/admin/AdminDashboard.js src/screens/admin/FinanceScreen.js

Write-Host "== ESLint --fix & Prettier =="
npx eslint --ext .js,.jsx src --fix
npx prettier -w "src/**/*.{js,jsx,css,md,json}"

Write-Host "== Lint After =="
npx eslint --ext .js,.jsx src --format json -o scripts/reports/lint-report.after.json

Write-Host "== Build Check =="
npm run build

Write-Host "== Diff Summary =="
git status --porcelain

Write-Host "== DONE =="
