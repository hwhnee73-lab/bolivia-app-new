import "@testing-library/jest-dom";

// Initialize i18n for all tests
import "./i18n/config";

// Force axios to load a CommonJS browser bundle in Jest.
jest.mock("axios", () => require("axios/dist/browser/axios.cjs"));
