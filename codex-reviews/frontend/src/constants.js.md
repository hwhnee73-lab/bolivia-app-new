**Overview**
- Purpose: Central app constants: API endpoint/key, demo users, and navigation metadata per persona.
- Responsibilities: Provide static configuration used across UI and services.

**Findings**
- MAJOR (lines 2–5): `API_KEY` stored client-side will be exposed in the bundle; use server-side proxy or env-injected server endpoint instead.
- MINOR (lines 6–9): Hardcoded demo credentials under `USERS`; risk of accidental usage in production.
- STYLE (lines ~22, ~31): Garbled characters in labels (e.g., `??Redactar`); fix encoding and ensure proper Unicode.

**Security & Reliability**
- Inputs: None.
- Side effects: If used as-is, leaks API key; rotate any published keys.
- Errors: N/A.

**Performance & Complexity**
- O(1), static data only.

**Readability & Maintainability**
- Consider splitting persona navigation into separate files or deriving from a single source of truth.
- Use TypeScript types or JSDoc for shape of `CONTENT_DATA`.

**Quick Fixes**
- Remove `API_KEY` from client. Use backend `/api/ai/generate` that injects the key server-side.
- Gate demo `USERS` behind dev flag or remove before release.
- Fix label encodings and run i18n consistency checks.

**Test Ideas**
- Unit: Ensure `CONTENT_DATA` includes expected ids used by router.
- Lint: Validate labels are proper UTF-8 and free of placeholders.

