**Overview**
- Purpose: Compose announcements with AI assistance and publish to backend.

**Findings**
- MINOR: Status strings and headings contain garbled `??`; fix encoding.
- MINOR: Simple parsing of AI output may fail if format deviates; consider more robust delimiters.

**Security & Reliability**
- Publishing endpoint `/api/announcements` should require auth; ensure tokens/cookies are included via context helper if needed.
- Avoid sending unsanitized HTML to backend; keep content plain text/Markdown.

**Performance & Complexity**
- O(1) generate + publish; fine.

**Readability & Maintainability**
- Factor AI interaction into a hook and standardize error handling and loading states.

**Quick Fixes**
- Use `fetchWithAuth` if announcements require auth; add `credentials: 'include'` when using httpOnly cookies.
- Trim and validate AI output before splitting title/content.

**Test Ideas**
- Generate: Mock AI returns; title/content extraction behaves as expected.
- Publish: Success and error toasts shown appropriately.

