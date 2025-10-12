/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',

  transform: {},

  injectGlobals: false,
  prettierPath: null,

  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['text', 'json', 'html'],
  coverageDirectory: './coverage',
};
