// jest.config.js
/* eslint-disable */

module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.json',
    },
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': './node_modules/ts-jest/preprocessor.js',
  },
  testMatch: ['**/test/**/*.test.(ts|js)'],
  testEnvironment: 'node',
};
