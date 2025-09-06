**Overview**
- Purpose: Global app state via React Context.
- Responsibilities: Auth/session state, view navigation, toast, and authenticated fetch helper.

**Findings**
- MINOR (lines ~31–35): `showToast` uses `setTimeout` without cleanup; safe here but note if component unmounts during timeout.
- MINOR (lines ~48–69): `fetchWithAuth` rethrows on 401 by calling `handleLogout` then throwing; consumer should handle rejection.

**Security & Reliability**
- Stores `accessToken` in memory only; safer than localStorage. Ensure HTTPS to protect header.
- On 401, logs out proactively; good.

**Performance & Complexity**
- O(1) state updates.

**Readability & Maintainability**
- Consider exposing a typed context shape; document `fetchWithAuth` usage expectations.

**Quick Fixes**
- Optionally add abort support to `fetchWithAuth`.
- Add cleanup for `setTimeout` if toasts are used in unmounting flows.

**Test Ideas**
- Verify `handleLoginSuccess` updates persona, user, token, and view.
- Verify 401 path logs out and throws.

