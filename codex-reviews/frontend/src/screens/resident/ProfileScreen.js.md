**Overview**
- Purpose: View/edit profile and logout.

**Findings**
- None blocking.

**Security & Reliability**
- Update call should be authenticated; sensitive user fields must be validated server-side.

**Performance & Complexity**
- O(1) update; minimal rendering.

**Readability & Maintainability**
- Extract `InfoRow` to shared component if reused.

**Quick Fixes**
- Use `fetchWithAuth`; show field validation errors from server.

**Test Ideas**
- Edit/save success updates context; error shows toast; logout navigates to auth.

