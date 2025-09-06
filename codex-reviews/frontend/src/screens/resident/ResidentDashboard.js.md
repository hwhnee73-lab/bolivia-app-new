**Overview**
- Purpose: Resident landing with quick links and summary.

**Findings**
- STYLE: Multiple garbled icon glyphs; replace with proper icons.

**Security & Reliability**
- N/A.

**Performance & Complexity**
- O(1).

**Readability & Maintainability**
- Replace textual icons with SVGs; derive quick-link cards from a config to reduce duplication.

**Quick Fixes**
- Map quick actions from `{id, label, icon}` array and render generically.

**Test Ideas**
- Clicking each card navigates to correct view.

