**Overview**
- Purpose: Resident bill list, detail toggle, and QR payment modal.

**Findings**
- None blocking; good state handling and toasts.

**Security & Reliability**
- Payment POST should be authenticated; validate `billId` server-side.

**Performance & Complexity**
- O(n) list; toggling expands details.

**Readability & Maintainability**
- Consider currency/locale formatting helpers.

**Quick Fixes**
- Replace placeholder QR image with generated QR from server.

**Test Ideas**
- Fetch list success/error; expand details; simulate successful payment updates status.

