module.exports = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts',
      '!<rootDir>/src/main/**',
      '!<rootDir>/src/shared/**',
      '!<rootDir>/src/**/*.module.ts',
      '!<rootDir>/src/**/*.helper**',
      '!<rootDir>/src/main.ts',
      '!<rootDir>/src/infra/ioc/**',
      '!<rootDir>/src/data/protocols/**',
      '!<rootDir>/src/presentation/**',
      '!<rootDir>/src/domain/**',
      '!<rootDir>/src/infra/config/**',
      '!<rootDir>/src/infra/middleware/**'

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
  
  