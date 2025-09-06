**Overview**
- Purpose: Browse facilities, create reservations, view and cancel own reservations.

**Findings**
- None blocking.

**Security & Reliability**
- Use authenticated calls; validate server-side conflicts and ownership on cancel.

**Performance & Complexity**
- Two parallel fetches; fine. Consider caching facilities.

**Readability & Maintainability**
- Extract reservation modal to component.

**Quick Fixes**
- Add `min` date for reservation input; validate time ranges client-side.

**Test Ideas**
- Fetch all data success/error; reserve success toast; cancel success; pending/approved states render.

