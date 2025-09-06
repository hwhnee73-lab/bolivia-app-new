**Overview**
- Purpose: Fetch and visualize monthly finance summary with Chart.js.

**Findings**
- None blocking.

**Security & Reliability**
- Handles error and loading states cleanly.
- Ensure `/api/finance/summary` requires auth if sensitive.

**Performance & Complexity**
- Chart instance cleanup handled; good.

**Readability & Maintainability**
- Extract chart options for reuse.

**Quick Fixes**
- Use `Intl.NumberFormat` for locale-aware numbers.

**Test Ideas**
- Mock fetch: loading, error, success render paths.
- Chart teardown on unmount.

