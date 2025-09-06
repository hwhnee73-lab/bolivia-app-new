**Overview**
- Purpose: Manage resident bills (list, create, edit, delete).

**Findings**
- CRITICAL (line 21): List call `fetchWithAuth('/admin/bills')` missing `/api` prefix; 404 risk.
- CRITICAL (line 68): Submit URL for edit `'/admin/bills/${id}'` missing `/api` prefix.
- MINOR (line 105): Input placeholder contains garbled characters; fix encoding.

**Security & Reliability**
- Uses `fetchWithAuth` for auth; good pattern once URLs are corrected.

**Performance & Complexity**
- O(n) table render; fine.

**Readability & Maintainability**
- Centralize endpoints and use a small client helper to avoid path drift.

**Quick Fixes**
- Prefix all endpoints with `/api` consistently.
- Consider optimistic updates for better UX.

**Test Ideas**
- Mock list/create/update/delete; confirm success toasts and table refresh.

