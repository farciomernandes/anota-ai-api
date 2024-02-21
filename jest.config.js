module.exports = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts',
      '!<rootDir>/src/**/*.module.ts',
      '!<rootDir>/src/**/*.helper**',
      '!<rootDir>/src/main.ts',
      '!<rootDir>/src/infra/ioc/**',
      '!<rootDir>/src/core/application/protocols/**',
      '!<rootDir>/src/core/domain/**',
      '!<rootDir>/src/infra/config/**',
      '!<rootDir>/src/infra/middleware/**',
      '!<rootDir>/src/presentation/**',
      '!<rootDir>/src/shared/**',

    ],
    coverageDirectory: "coverage",
    testEnvironment: 'node',
    preset: '@shelf/jest-mongodb',
    transform: {
      '.+\\.ts$': 'ts-jest'
    },
    moduleNameMapper: {
      '@/(.*)': '<rootDir>/src/$1'
    }
  };
  
  