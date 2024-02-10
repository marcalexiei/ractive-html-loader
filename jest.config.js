export default {
  testEnvironment: 'node',

  transform: {},

  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['text', 'json', 'html'],
  coverageDirectory: './coverage',
};
