**Overview**
- Purpose: Admin approval workflow for facility reservations.

**Findings**
- CRITICAL (line 34): Update call uses `fetch(`/admin/reservations/${id}`)` missing the `/api` prefix used elsewhere; results in 404 through Nginx.

**Security & Reliability**
- Approval actions should be authenticated; consider `fetchWithAuth`.

**Performance & Complexity**
- O(n) render; trivial.

**Readability & Maintainability**
- Centralize base path (`/api`) to avoid inconsistencies.

**Quick Fixes**
- Change to `fetch('/api/admin/reservations/...')` and, if using cookies/tokens, include credentials/auth headers.

**Test Ideas**
- Mock both list and update endpoints; assert UI updates local state after approval.

