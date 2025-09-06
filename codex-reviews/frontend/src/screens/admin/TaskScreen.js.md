**Overview**
- Purpose: Admin maintenance/task management (list, CRUD).

**Findings**
- CRITICAL (line 45): Delete call uses `fetch('/admin/tasks/...')` missing `/api` prefix.
- CRITICAL (line 64): Edit URL uses `'/admin/tasks/${id}'` missing `/api` prefix.

**Security & Reliability**
- Should require auth; consider using `fetchWithAuth`.

**Performance & Complexity**
- O(n) list render; fine.

**Readability & Maintainability**
- Centralize base API path.

**Quick Fixes**
- Prefix with `/api` and use context helper for auth.

**Test Ideas**
- Mock endpoints; verify success toasts and refresh.

