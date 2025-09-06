**Overview**
- Purpose: Smoke test to ensure Auth screen renders by default.

**Findings**
- MINOR: Test asserts a heading containing "bienvenido"; relies on case-insensitive match and Spanish copy. Could be brittle if copy changes.

**Security & Reliability**
- N/A.

**Performance & Complexity**
- O(1) render; fine.

**Readability & Maintainability**
- Prefer role-based queries with more stable labels or test ids when appropriate.

**Quick Fixes**
- Consider `getByRole('heading', { name: /bienvenido a apt/i })` to be more specific, or add a `data-testid`.

**Test Ideas**
- Add navigation tests for a couple of views using context.

