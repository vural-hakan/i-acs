/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: ['.*\\.spec\\.ts$'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageReporters: ['text', 'json-summary', 'html'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

module.exports = config;
