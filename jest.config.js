module.exports = {
  testEnvironment: 'node',

  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageReporters: ['text', 'json', 'html'],
  coverageDirectory: './coverage',
};
