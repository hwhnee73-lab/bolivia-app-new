**Overview**
- Purpose: Quick navigation back to `dashboard`.
- Responsibilities: Render a clickable control to navigate home.

**Findings**
- MAJOR (line 5): Clickable `<div>` without button semantics harms accessibility and keyboard use. Use `<button>` with accessible label.
- STYLE (line 5): Garbled glyph `?��` suggests encoding issue; replace with a proper icon or text.

**Security & Reliability**
- No external inputs.

**Performance & Complexity**
- O(1).

**Readability & Maintainability**
- Prefer a consistent icon system (e.g., Heroicons) instead of raw glyphs.

**Quick Fixes**
- Replace with `<button aria-label="Ir al panel" ...>` and an SVG icon.

**Test Ideas**
- Unit: Triggers `navigateTo('dashboard')` on click and via Enter/Space key.

