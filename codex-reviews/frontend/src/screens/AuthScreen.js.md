**Overview**
- Purpose: Login screen and flow.
- Responsibilities: Collect credentials, call `/api/auth/login`, update context on success.

**Findings**
- MAJOR (lines 19–25): If backend uses httpOnly Refresh Token cookies, `fetch` should include `credentials: 'include'` to receive/set cookies via Nginx.
- MINOR (lines 7–8): Pre-filled default credentials in state; remove for production.
- STYLE: Glyph `?��` as logo; replace with proper icon.

**Security & Reliability**
- Handles non-JSON error bodies gracefully; good.
- Ensure HTTPS and CSRF protections server-side when using cookies.

**Performance & Complexity**
- O(1) network call.

**Readability & Maintainability**
- Consider clear field names: `username` or `email` instead of `id` to match backend DTO.

**Quick Fixes**
- Add `credentials: 'include'` to login `fetch` when cookie-based refresh is expected.
- Remove default credentials.

**Test Ideas**
- Success path sets context and navigates to `dashboard`.
- Error path shows server-provided message.

