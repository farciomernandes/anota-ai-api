module.exports = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts',
      '!<rootDir>/src/main/**',
      '!<rootDir>/src/main.ts',
      '!<rootDir>/src/infra/ioc/**',
      '!<rootDir>/src/data/protocols/**',
      '!<rootDir>/src/presentation/**'
    ],
    coverageDirectory: "coverage",
    testEnvironment: 'node',
    preset: '@shelf/jest-mongodb',
    transform: {
      '.+\\.ts$': 'ts-jest'
    }
  };
  
  