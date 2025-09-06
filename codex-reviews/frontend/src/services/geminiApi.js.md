**Overview**
- Purpose: Frontend service wrapper to call Google Gemini API.

**Findings**
- MAJOR (lines 3–7): Calls third-party API directly from client and interpolates `API_KEY`; exposes key to users. Proxy through backend.
- MINOR: Lack of timeout/abort; long-hanging requests possible.

**Security & Reliability**
- Key exposure risk; rotate any leaked key. Prefer server-side call with auth and rate-limiting.

**Performance & Complexity**
- O(1) call; add `AbortController` to cancel on unmount.

**Readability & Maintainability**
- Return a structured result `{ ok, text, error }` rather than raw string for better flow control.

**Quick Fixes**
- Replace with `/api/ai/generate` backend endpoint; remove API key from client bundle.
- Add abort/timeout and clearer error messages.

**Test Ideas**
- Mock success/error and ensure callers handle both paths.

