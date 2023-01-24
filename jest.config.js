module.exports = {
  // testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  coverageDirectory: './coverage/',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['.*\\.d\\.ts', 'index\\.ts', 'polyfilled\\.ts', 'createAction.ts'],
  restoreMocks: true,
  clearMocks: true,
  // setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};
