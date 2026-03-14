import "@testing-library/jest-dom";

// Force axios to load a CommonJS browser bundle in Jest.
jest.mock("axios", () => require("axios/dist/browser/axios.cjs"));
