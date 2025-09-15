import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { CONSTANTS } from "../constants";
import http, {
  setAccessToken as setHttpAccessToken,
  setOnUnauthorized,
} from "../services/http";

const AppContext = createContext(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};

const DEBUG_DEFAULT =
  (typeof window !== "undefined" &&
    (window.localStorage.getItem("DEBUG") === "1" ||
      process.env.NODE_ENV !== "production")) ||
  false;

const MAX_LOGS = 300;
const LOG_UPLOAD_URL = "/meta/client-logs"; // 서버에 수집 API가 있다면 이 경로로 변경하세요.

/** 민감 정보 마스킹 유틸 */
const redact = (value) => {
  if (value == null) return value;
  const str = typeof value === "string" ? value : JSON.stringify(value);
  // 토큰/패스워드/Authorization 헤더 등 마스킹
  return str
    .replace(/(Bearer\s+)[\w\-.]+/gi, "$1***")
    .replace(/("accessToken"\s*:\s*")([^"]+)(")/gi, "$1***$3")
    .replace(/("refreshToken"\s*:\s*")([^"]+)(")/gi, "$1***$3")
    .replace(/("password"\s*:\s*")([^"]+)(")/gi, "$1***$3")
    .replace(/(password=)[^&\s]+/gi, "$1***");
};

/** JWT payload 디코딩(실패 시 null) */
const decodeJwt = (token) => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const AppProvider = ({ children }) => {
  const [persona, setPersona] = useState("resident");
  const [activeView, setActiveView] = useState("auth");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState({ message: "", isVisible: false });
  const [accessToken, setAccessToken] = useState(null);

  // --- 디버그 상태/로거 ---
  const [debugEnabled, setDebugEnabled] = useState(!!DEBUG_DEFAULT);
  const [logs, setLogs] = useState([]);
  const toastTimerRef = useRef(null);

  const pushLog = useCallback(
    (level, message, extra) => {
      const entry = {
        ts: new Date().toISOString(),
        level, // 'debug' | 'info' | 'warn' | 'error'
        message,
        extra,
      };
      setLogs((prev) => {
        const next = [...prev, entry];
        if (next.length > MAX_LOGS) next.splice(0, next.length - MAX_LOGS);
        return next;
      });
      if (debugEnabled && typeof window !== "undefined") {
        // 콘솔 출력(개발 시)
        // eslint-disable-next-line no-console
        (console[level] || console.log)(
          `[${level.toUpperCase()}] ${message}`,
          extra ?? "",
        );
      }
      return entry;
    },
    [debugEnabled],
  );

  const clearLogs = useCallback(() => setLogs([]), []);
  const dumpState = useCallback(() => {
    return {
      ts: new Date().toISOString(),
      persona,
      activeView,
      isLoggedIn,
      currentUser,
      hasAccessToken: !!accessToken,
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "n/a",
    };
  }, [persona, activeView, isLoggedIn, currentUser, accessToken]);

  const downloadLogs = useCallback(() => {
    const payload = {
      meta: dumpState(),
      logs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bolivia-app-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs, dumpState]);

  const uploadLogs = useCallback(async () => {
    try {
      await http.post(LOG_UPLOAD_URL, { meta: dumpState(), logs });
      pushLog("info", "Client logs uploaded", { count: logs.length });
      showToast("진단 로그를 서버로 전송했습니다.");
    } catch (err) {
      pushLog("error", "Failed to upload logs", {
        status: err?.response?.status,
        err,
      });
      showToast("로그 전송 실패(네트워크 확인).");
    }
  }, [logs, dumpState]); // showToast는 아래에서 정의되지만, 호이스팅 영향없음(런타임 시점에 클로저 됨)

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, isVisible: true });
    toastTimerRef.current = setTimeout(
      () => setToast({ message: "", isVisible: false }),
      3000,
    );
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const navigateTo = useCallback(
    (viewId) => {
      setActiveView(viewId);
      setIsMenuOpen(false);
      pushLog("debug", "Navigate", { viewId });
    },
    [pushLog],
  );

  // 최초 마운트 시 토큰 로드 + http 인스턴스에 세팅
  useEffect(() => {
    const saved = window.localStorage.getItem("accessToken");
    if (saved) {
      pushLog("info", "Restore access token from localStorage");
      setAccessToken(saved);
      setHttpAccessToken(saved);
      const payload = decodeJwt(saved);
      const role = payload?.role || "RESIDENT";
      const username = payload?.sub || payload?.username;
      setCurrentUser(
        (prev) => prev ?? { username, role, email: payload?.email },
      );
      setPersona(role === "ADMIN" ? "admin" : "resident");
      setIsLoggedIn(true);
      setActiveView("dashboard");
    }
  }, [pushLog]);

  // accessToken 변경 시 영속화/해제
  useEffect(() => {
    if (accessToken) {
      window.localStorage.setItem("accessToken", accessToken);
      setHttpAccessToken(accessToken);
    } else {
      window.localStorage.removeItem("accessToken");
      setHttpAccessToken(null);
    }
  }, [accessToken]);

  // 401 전역 처리(한 번만 등록)
  useEffect(() => {
    setOnUnauthorized(() => {
      pushLog("warn", "HTTP 401 – auto logout triggered");
      setIsLoggedIn(false);
      setCurrentUser(null);
      setAccessToken(null);
      setActiveView("auth");
      showToast("세션이 만료되었습니다. 다시 로그인 해주세요.");
    });
    pushLog("debug", "setOnUnauthorized handler registered");
  }, [pushLog, showToast]);

  // 전역 에러/Promise 거부 캡처
  useEffect(() => {
    const onError = (e) => {
      pushLog("error", "Uncaught error", {
        message: e.message,
        stack: e.error?.stack,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
      });
    };
    const onRejection = (e) => {
      pushLog("error", "Unhandled promise rejection", {
        reason: String(e.reason),
      });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [pushLog]);

  // 디버그 패널 토글(선택): CTRL+ALT+D
  const [debugPanelOpen, setDebugPanelOpen] = useState(false);
  useEffect(() => {
    const hotkey = (e) => {
      const key = e.key?.toLowerCase();
      if (e.ctrlKey && e.altKey && key === "d") {
        setDebugPanelOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", hotkey);
    return () => window.removeEventListener("keydown", hotkey);
  }, []);

  // Login with email/username + password
  const login = async (id, password) => {
    pushLog("info", "Login attempt", { id });
    const t0 = performance.now();
    try {
      const res = await http.post("/auth/login", { id, password });

      console.log("Login API Response:", res);

      const token = res?.data?.accessToken;

      setAccessToken(token);
      setHttpAccessToken(token);

      // 사용자 정보 결정: 우선 서버 응답 → JWT payload
      const apiUser = res?.data?.user;
      const payload = decodeJwt(token);

      console.log("API 응답 유저 정보:", apiUser);
      console.log("JWT 토큰 payload:", payload);

      const role = apiUser?.role || payload?.auth || "RESIDENT"; // 수정된 코드

      console.log("최종 결정된 역할:", role);

      const username =
        apiUser?.username || apiUser?.email || payload?.sub || id;
      const email = apiUser?.email || (id.includes("@") ? id : payload?.email);

      const minimalUser = { username, email, role };
      setCurrentUser(minimalUser);
      setPersona(role === "ADMIN" ? "admin" : "resident");
      setIsLoggedIn(true);
      setActiveView("dashboard");

      pushLog("info", "Login success", {
        ms: Math.round(performance.now() - t0),
        user: { username, role, email },
      });
    } catch (err) {
      pushLog("error", "Login failed", {
        ms: Math.round(performance.now() - t0),
        status: err?.response?.status,
        data: redact(err?.response?.data),
      });
      showToast("로그인 실패: 아이디/비밀번호 또는 네트워크를 확인하세요.");
      throw err;
    }
  };

  const handleLogout = async () => {
    pushLog("info", "Logout requested");
    const t0 = performance.now();
    try {
      await http.post("/auth/logout");
      pushLog("debug", "Logout API called", {
        ms: Math.round(performance.now() - t0),
      });
    } catch (err) {
      // 무시하지만 로그 남김
      pushLog("warn", "Logout API failed", {
        status: err?.response?.status,
        data: redact(err?.response?.data),
      });
    }
    setIsLoggedIn(false);
    setCurrentUser(null);
    setAccessToken(null);
    setActiveView("auth");
    showToast("Se ha cerrado la sesión.");
  };

  // Axios-backed wrapper with fetch-like interface + 디버그 로깅
  const fetchWithAuth = async (url, options = {}) => {
    const method = (options.method || "GET").toUpperCase();
    const headers = options.headers || {};
    const data = options.body ? options.body : undefined;

    const t0 = performance.now();
    pushLog("debug", "HTTP request", {
      url,
      method,
      headers: redact(headers),
      bodyPreview: data
        ? redact(typeof data === "string" ? data : JSON.stringify(data))
        : undefined,
    });

    try {
      const res = await http.request({ url, method, headers, data });
      const ms = Math.round(performance.now() - t0);
      pushLog("info", "HTTP response", {
        url,
        status: res.status,
        ms,
        size: (() => {
          try {
            const s = JSON.stringify(res.data);
            return s ? s.length : undefined;
          } catch {
            return undefined;
          }
        })(),
      });
      return { ok: true, status: res.status, json: async () => res.data };
    } catch (err) {
      const resp = err?.response;
      const ms = Math.round(performance.now() - t0);
      if (!resp) {
        pushLog("error", "HTTP network error", { url, ms, err: String(err) });
        throw err;
      }
      pushLog("warn", "HTTP error response", {
        url,
        status: resp.status,
        ms,
        data: redact(resp.data),
      });
      return { ok: false, status: resp.status, json: async () => resp.data };
    }
  };

  const value = {
    // 기존 값
    persona,
    activeView,
    isLoggedIn,
    currentUser,
    setCurrentUser,
    isMenuOpen,
    contentData: CONSTANTS.CONTENT_DATA,
    toast,
    navigateTo,
    login,
    handleLogout,
    showToast,
    setIsMenuOpen,
    fetchWithAuth,
    accessToken,

    // 디버그/진단
    debugEnabled,
    setDebugEnabled,
    logs,
    clearLogs,
    downloadLogs,
    uploadLogs,
    dumpState,
    debugPanelOpen,
    setDebugPanelOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
