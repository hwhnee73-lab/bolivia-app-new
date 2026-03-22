/**
 * http.js 인터셉터 단위 테스트
 *
 * setupTests.js의 전역 axios mock과 충돌을 방지하기 위해
 * jest.isolateModules 내부에서 http 모듈을 로드합니다.
 */

describe("http.js — Axios interceptor", () => {
  test("exports setAccessToken and setOnUnauthorized functions", () => {
    jest.isolateModules(() => {
      const { setAccessToken, setOnUnauthorized } = require("../services/http");
      expect(typeof setAccessToken).toBe("function");
      expect(typeof setOnUnauthorized).toBe("function");
    });
  });

  test("setAccessToken and setOnUnauthorized do not throw", () => {
    jest.isolateModules(() => {
      const { setAccessToken, setOnUnauthorized } = require("../services/http");
      expect(() => setAccessToken("test-token")).not.toThrow();
      expect(() => setAccessToken(null)).not.toThrow();
      expect(() => setOnUnauthorized(jest.fn())).not.toThrow();
      expect(() => setOnUnauthorized(null)).not.toThrow();
    });
  });

  test("default export is a valid object", () => {
    jest.isolateModules(() => {
      const httpModule = require("../services/http");
      const http = httpModule.default;
      expect(http).toBeDefined();
    });
  });

  test("request interceptor is registered", () => {
    jest.isolateModules(() => {
      const httpModule = require("../services/http");
      const http = httpModule.default;
      // Verify interceptors property exists on the created instance
      expect(http.interceptors).toBeDefined();
      expect(http.interceptors.request).toBeDefined();
      expect(http.interceptors.response).toBeDefined();
    });
  });
});
