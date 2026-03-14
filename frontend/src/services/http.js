import axios from "axios";

// Build-time configurable API base URL.
// When REACT_APP_API_URL is not provided we default to the relative `/api`
// path so Nginx (or CRA proxy) can forward requests as before.
const normalizeBaseUrl = (value, fallback = "/api") => {
  if (!value || !value.trim()) return fallback;
  const trimmed = value.trim();
  if (trimmed === "/") return "/";
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
};

const API_BASE_URL = normalizeBaseUrl(process.env.REACT_APP_API_URL);

// In-memory Access Token (no storage at rest)
let accessToken = null;
let isRefreshing = false;
let pending = [];
let onUnauthorized = null; // optional app callback (e.g., logout)

export const setAccessToken = (token) => {
  accessToken = token || null;
};

export const setOnUnauthorized = (handler) => {
  onUnauthorized = typeof handler === "function" ? handler : null;
};

// Base HTTP client for app APIs
const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Separate client for token refresh to avoid Authorization header coupling
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function refreshAccessToken() {
  const res = await refreshClient.post("/auth/refresh");
  const newToken = res?.data?.accessToken;
  if (!newToken) throw new Error("Missing accessToken in refresh response");
  accessToken = newToken;
  return newToken;
}

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error || {};
    if (!response) return Promise.reject(error);

    if (response.status === 401 && config && !config._retry) {
      // Retry gate
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pending.push({ resolve, reject });
        })
          .then((token) => {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
            config._retry = true;
            return http(config);
          })
          .catch((err) => Promise.reject(err));
      }

      config._retry = true;
      isRefreshing = true;
      try {
        const token = await refreshAccessToken();
        pending.forEach((p) => p.resolve(token));
        pending = [];
        isRefreshing = false;
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        return http(config);
      } catch (e) {
        pending.forEach((p) => p.reject(e));
        pending = [];
        isRefreshing = false;
        accessToken = null;
        if (onUnauthorized) {
          try {
            onUnauthorized();
          } catch (_) { }
        }
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  },
);

export default http;
