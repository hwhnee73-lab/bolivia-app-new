**Overview**
- Purpose: Resident community board (list, create, view posts).

**Findings**
- None blocking.

**Security & Reliability**
- Ensure content displayed is plain text; avoid rendering raw HTML from server.
- Posting should be authenticated.

**Performance & Complexity**
- O(n) list; modal per selection.

**Readability & Maintainability**
- Consider pagination/infinite scroll if list grows.

**Quick Fixes**
- Use `fetchWithAuth` if required; show empty state when no posts.

**Test Ideas**
- List fetch success/error; create success flow clears form and refreshes.

