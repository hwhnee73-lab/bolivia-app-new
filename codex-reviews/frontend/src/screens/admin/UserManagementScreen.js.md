**Overview**
- Purpose: Admin user management (list, create, edit, delete).

**Findings**
- CRITICAL (line 48): Delete call uses `fetch('/admin/users/...')` missing `/api` prefix.
- CRITICAL (line 67): Edit URL uses `'/admin/users/${id}'` missing `/api` prefix.

**Security & Reliability**
- Should include auth (use `fetchWithAuth`) and handle authorization errors.

**Performance & Complexity**
- O(n) table render; fine.

**Readability & Maintainability**
- Extract form into sub-component to declutter.

**Quick Fixes**
- Prefix with `/api` and use authenticated fetch.

**Test Ideas**
- Mock list/create/update/delete; ensure state updates and toasts show.

