**Overview**
- Purpose: Resident maintenance request submission and status list.

**Findings**
- None blocking.

**Security & Reliability**
- Posting should be authenticated; ensure CSRF protections if cookie-based auth.

**Performance & Complexity**
- O(n) list; fine.

**Readability & Maintainability**
- Consider form validation and category constants.

**Quick Fixes**
- Use constants for categories; show empty state.

**Test Ideas**
- Submit success/error; list fetch flows; status color mapping.

