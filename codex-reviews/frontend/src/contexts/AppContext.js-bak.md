**Overview**
- Purpose: Backup copy of context prior to token-aware version.

**Findings**
- STYLE: Backup file in `src` increases noise; should be removed or moved outside build inputs.

**Security & Reliability**
- Avoid stale code paths accidentally imported.

**Performance & Complexity**
- N/A.

**Readability & Maintainability**
- Remove `*-bak` files from `src` to prevent accidental usage.

**Quick Fixes**
- Delete or move to docs; if needed, add `.bak` to `.eslintignore` & build ignore.

**Test Ideas**
- N/A.

