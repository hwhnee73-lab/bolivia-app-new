**Overview**
- Purpose: Global toast notification.

**Findings**
- None blocking.

**Security & Reliability**
- Ensure messages are plain text (they are); do not render HTML.

**Performance & Complexity**
- O(1) conditional render.

**Readability & Maintainability**
- Consider ARIA live region for accessibility.

**Quick Fixes**
- Add `role="status"` and `aria-live="polite"`.

**Test Ideas**
- Shows/hides with context; auto hides after timeout.

