module.exports = {
  preset: 'ts-jest/presets/default-esm',
  collectCoverageFrom: ['src/**/*'],
  testPathIgnorePatterns: ['.*/dist/.*', '.*dist.*'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '\\.[jt]sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};
