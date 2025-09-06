**Per-File Summary**
- frontend/src/App.js: critical 0, major 0, minor 2, style 1 — Simplify routing; dedupe intro case.
- frontend/src/constants.js: critical 0, major 1, minor 1, style 1 — API key exposure; fix labels.
- frontend/src/index.js: critical 0, major 0, minor 0, style 0 — OK.
- frontend/src/setupTests.js: critical 0, major 0, minor 0, style 0 — OK.
- frontend/src/test-utils.js: critical 0, major 0, minor 1, style 1 — Improve fetch mock restore.
- frontend/src/components/common/HomeButton.js: critical 0, major 1, minor 0, style 1 — Use button semantics; fix icon.
- frontend/src/components/common/Modal.js: critical 0, major 0, minor 1, style 0 — Add accessibility roles/labels.
- frontend/src/components/common/PhoneMockup.js: critical 0, major 0, minor 1, style 0 — Default className.
- frontend/src/components/common/Toast.js: critical 0, major 0, minor 1, style 0 — ARIA live region.
- frontend/src/components/layout/BottomNavBar.js: critical 1, major 0, minor 0, style 1 — Broken string literals; replace icons.
- frontend/src/components/layout/Footer.js: critical 0, major 0, minor 1, style 0 — Dynamic year.
- frontend/src/components/layout/Header.js: critical 0, major 0, minor 1, style 0 — Add aria-label.
- frontend/src/components/layout/SlideOutMenu.js: critical 0, major 0, minor 1, style 0 — Use button instead of anchor.
- frontend/src/contexts/AppContext.js: critical 0, major 0, minor 2, style 0 — Timeout cleanup; document fetchWithAuth.
- frontend/src/contexts/AppContext.js-bak: critical 0, major 0, minor 0, style 1 — Remove backup from src.
- frontend/src/screens/AuthScreen.js: critical 0, major 1, minor 1, style 1 — Include credentials with cookies; remove default creds; icon.
- frontend/src/screens/IntroInfographicScreen.js: critical 1, major 0, minor 1, style 1 — Fix malformed JSX; icons.
- frontend/src/screens/PlaceholderScreen.js: critical 0, major 0, minor 0, style 0 — OK.
- frontend/src/screens/admin/AdminDashboard.js: critical 1, major 1, minor 0, style 1 — Sanitize AI HTML; avoid regex markdown; fix labels.
- frontend/src/screens/admin/CommunicationScreen.js: critical 0, major 0, minor 1, style 1 — Robust parse; fix labels.
- frontend/src/screens/admin/FinanceScreen.js: critical 0, major 0, minor 1, style 0 — Number formatting.
- frontend/src/screens/admin/ReservationApprovalScreen.js: critical 1, major 0, minor 0, style 0 — Missing /api prefix on update.
- frontend/src/screens/admin/ResidentManagementScreen.js: critical 2, major 0, minor 1, style 1 — Missing /api on list/edit; fix placeholder.
- frontend/src/screens/admin/ResidentManagementScreen.js-bak: critical 0, major 0, minor 0, style 1 — Remove backup.
- frontend/src/screens/admin/TaskScreen.js: critical 2, major 0, minor 0, style 0 — Missing /api on edit/delete.
- frontend/src/screens/admin/UserManagementScreen.js: critical 2, major 0, minor 0, style 0 — Missing /api on edit/delete.
- frontend/src/screens/resident/CommunityScreen.js: critical 0, major 0, minor 0, style 0 — OK; consider pagination later.
- frontend/src/screens/resident/MaintenanceScreen.js: critical 0, major 0, minor 0, style 0 — OK.
- frontend/src/screens/resident/PaymentScreen.js: critical 0, major 0, minor 0, style 0 — OK.
- frontend/src/screens/resident/ProfileScreen.js: critical 0, major 0, minor 0, style 0 — OK.
- frontend/src/screens/resident/ReservationScreen.js: critical 0, major 0, minor 0, style 0 — OK.
- frontend/src/screens/resident/ResidentDashboard.js: critical 0, major 0, minor 0, style 1 — Replace icons.
- frontend/src/services/geminiApi.js: critical 0, major 1, minor 1, style 0 — Move to backend; add abort/timeout.
- frontend/src/__tests__/App.test.jsx: critical 0, major 0, minor 1, style 0 — Stabilize copy/selector.

**Top Risks**
- XSS via untrusted AI content rendered with `dangerouslySetInnerHTML` (AdminDashboard).
- Build-breaking syntax errors in `BottomNavBar.js` and malformed JSX in `IntroInfographicScreen.js`.
- Inconsistent API base path (missing `/api`) in several admin screens causing failed requests.
- API key exposure and direct third-party calls from client (`geminiApi.js`, `constants.js`).
- Accessibility issues (non-semantic clickable elements, missing aria attributes).

**Prioritized TODO**
- P0: Fix all build errors and encoding glitches (BottomNavBar, IntroInfographicScreen, icon glyphs).
- P0: Sanitize or avoid raw HTML for AI content; remove `dangerouslySetInnerHTML` or sanitize strictly.
- P0: Standardize API client with base `/api` and auth helper; correct endpoints in admin screens.
- P1: Move Gemini calls server-side; remove API key from frontend; rotate any exposed key.
- P1: Accessibility pass: replace anchors/divs with buttons, add aria labels/live regions.
- P2: Remove `*-bak` files from `src` and clean constants labels.
- P2: Add unit tests for admin CRUD flows and auth/login cookie handling.

