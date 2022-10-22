/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // transform: {
  //   '^.+\\.(ts|tsx)?$': 'ts-jest',
  //   "^.+\\.(js|jsx)$": "babel-jest",
  // },
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  transformIgnorePatterns: ['<rootDir>/node_modules/']
};