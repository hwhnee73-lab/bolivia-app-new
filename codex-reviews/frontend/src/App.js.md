**Overview**
- Purpose: Root component wiring layout, context provider, and simple view routing based on `persona`, `isLoggedIn`, and `activeView`.
- Responsibilities: Chooses which screen to render, renders global layout components (Header, Menu, Footer, Toast, BottomNavBar).

**Findings**
- MINOR (lines ~16–33): Duplicate handling for `activeView === 'intro'` both before persona switch and inside each switch; keep a single source of truth.
- MINOR (lines ~18–33): Large switch statements are verbose; a mapping table would improve maintainability.
- STYLE: Mixed language comments; ensure consistent language for the codebase.

**Security & Reliability**
- Inputs: Relies on `useAppContext()` state; no external inputs.
- Errors: No error boundaries; if any child throws, whole tree may crash. Consider a top-level error boundary.
- Side effects: None.

**Performance & Complexity**
- Complexity: O(1) render selection; no heavy computations.
- Hot paths: Frequent re-render as context updates; fine.

**Readability & Maintainability**
- Prefer a config map `{persona: {viewId: Component}}` to avoid large switches and duplicated defaults.
- Co-locate valid view ids as constants to reduce drift.

**Quick Fixes**
- Replace switches with a map: `const routes = { resident: { dashboard: ResidentDashboard, ...}, admin: {...} }` then `const C = routes[persona]?.[activeView] ?? routes[persona].dashboard`.
- Remove duplicated `intro` case; handle once before persona routing.

**Test Ideas**
- Unit: Given various `activeView/persona/isLoggedIn`, assert correct screen renders.
- Snapshot: Layout renders header/footer/menu consistently.
- Edge: Unknown `activeView` falls back to dashboard.

