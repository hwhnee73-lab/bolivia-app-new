// Re-export the unified HTTP client that keeps Access tokens in-memory only.
// This avoids any storage-at-rest of credentials and centralizes refresh logic.
import http from './http';

export default http;
