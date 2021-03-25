module.exports = {
  testEnvironment: 'node',

  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['text', 'json', 'html'],
  coverageDirectory: './coverage',
};
