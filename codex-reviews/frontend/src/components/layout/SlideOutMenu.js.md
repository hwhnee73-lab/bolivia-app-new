**Overview**
- Purpose: Slide-out side menu listing available nav items per persona and auth state.

**Findings**
- MINOR (lines ~12–16): Uses `<a href="#">` with `preventDefault` for navigation; prefer `<button>` for semantics.

**Security & Reliability**
- Renders names from constants; ensure they’re trusted strings.

**Performance & Complexity**
- O(n) over nav items; trivial.

**Readability & Maintainability**
- Good separation. Consider memoizing `navItems` derivation for clarity.

**Quick Fixes**
- Replace anchor with `<button>` and appropriate classes.

**Test Ideas**
- Menu visibility toggles; clicking an item calls `navigateTo(item.id)` and closes menu.

