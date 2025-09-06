**Overview**
- Purpose: Generic modal with overlay, title, and content.

**Findings**
- MINOR: Close button relies on `&times;` text; acceptable but consider an accessible label.

**Security & Reliability**
- Contents are children; ensure parent sanitizes any HTML before passing.

**Performance & Complexity**
- O(1); conditional render when `isOpen`.

**Readability & Maintainability**
- Consider focus trap and ESC handling for accessibility.

**Quick Fixes**
- Add `role="dialog"`, `aria-modal="true"`, and focus management when opened.

**Test Ideas**
- Visibility toggles; backdrop click closes; title renders.

