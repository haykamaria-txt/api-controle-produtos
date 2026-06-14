module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.js", "!src/server.js"],
  passWithNoTests: true,
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js", "**/?(*.)+(spec|test).js"],
};
