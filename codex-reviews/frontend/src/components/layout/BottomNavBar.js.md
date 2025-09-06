**Overview**
- Purpose: Bottom navigation for quick access to key views by persona.

**Findings**
- CRITICAL (lines 20–21): Broken string literals for `icon` values cause syntax errors and prevent the app from building. Fix quoting and encoding.
- STYLE (lines 11–15, 18–21): Garbled glyphs for icons; replace with proper SVGs or a consistent icon set.

**Security & Reliability**
- None specific; rendering only.

**Performance & Complexity**
- O(n) over nav items; trivial.

**Readability & Maintainability**
- Extract nav config to constants to avoid in-component duplication with `constants.js`.

**Quick Fixes**
- Fix quotes: e.g., `{ id: 'task', icon: '🛠️', label: 'Mantenimiento' }` and `{ id: 'reservation_approval', icon: '✅', label: 'Aprobar' }`.
- Use `<svg>` icons for consistent rendering.

**Test Ideas**
- Render for resident/admin personas; ensure active state class toggles correctly.
- Hidden on `dashboard`, `auth`, `intro` views.

