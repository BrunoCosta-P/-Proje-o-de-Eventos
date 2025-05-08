// jest.config.js
module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'], 
    globalSetup: 'jest-preset-angular/global-setup',
    testPathIgnorePatterns: [
      '<rootDir>/node_modules/',
      '<rootDir>/dist/',
      '<rootDir>/src/test.ts', 
    ],
    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    },
    moduleNameMapper: { 
      '^@app/(.*)$': '<rootDir>/src/app/$1',
      '^@assets/(.*)$': '<rootDir>/src/assets/$1',
      '^@env/(.*)$': '<rootDir>/src/environments/$1',
      
    },
    transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'] 
  };