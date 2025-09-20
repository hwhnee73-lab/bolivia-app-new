import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { AuthProvider } from "./contexts/AuthContext";

export const renderWithProvider = (ui, options) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>{ui}</AppProvider>
      </AuthProvider>
    </BrowserRouter>,
    options,
  );
};

export const mockFetch = (json, ok = true, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => json,
  });
};

export const restoreFetch = () => {
  if (global.fetch && "mockClear" in global.fetch) {
    global.fetch.mockClear();
  }
};
