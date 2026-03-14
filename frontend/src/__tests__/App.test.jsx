import "@testing-library/jest-dom";
import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProvider } from "../test-utils";
import App from "../App";

test("renders Login screen by default", async () => {
  renderWithProvider(<App />);
  // Login page has an H1 with text 'Bolivia'
  expect(
    await screen.findByRole("heading", { name: /Bolivia/i })
  ).toBeInTheDocument();
});
