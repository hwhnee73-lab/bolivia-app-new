import "@testing-library/jest-dom";
import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProvider } from "../test-utils";
import App from "../App";

// Mock authService to prevent real HTTP calls during mount
jest.mock("../services/authService", () => ({
  __esModule: true,
  default: {
    login: jest.fn().mockRejectedValue(new Error("not authenticated")),
    logout: jest.fn().mockResolvedValue({}),
    refreshToken: jest.fn().mockRejectedValue(new Error("no session")),
    getCurrentUser: jest.fn().mockRejectedValue(new Error("not authenticated")),
  },
}));

test("renders Login screen by default", async () => {
  renderWithProvider(<App />);
  // AuthContext calls refreshToken on mount → fails → isLoading becomes false → Login page renders
  expect(
    await screen.findByRole("heading", { name: /Bolivia/i })
  ).toBeInTheDocument();
});
