**Overview**
- Purpose: Helpers to render with context provider and mock `fetch` in tests.

**Findings**
- MINOR (lines 9–16): `mockFetch` sets `global.fetch` but `restoreFetch` only `mockClear`s; tests may leak mocks across suites.
- STYLE: Consider returning the mock to let tests assert calls.

**Security & Reliability**
- Global mutation of `fetch` can affect parallel tests.

**Performance & Complexity**
- O(1).

**Readability & Maintainability**
- Provide `afterEach(restoreFetch)` guidance.

**Quick Fixes**
- Add `const originalFetch = global.fetch` snapshot and restore in `restoreFetch`.
- Export the mock instance from `mockFetch` for assertions.

**Test Ideas**
- Verify `renderWithProvider` supplies context by asserting default values.
- Verify `mockFetch` response shape is awaited correctly.

