export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  
  transformIgnorePatterns: [
    'node_modules/(?!(module-that-needs-to-be-transformed)/)'
  ],
  reporters: [
    'default',
    [
      'jest-html-reporter', 
      {
        pageTitle: 'Test Report',
        outputPath: './test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true
      }
    ]
  ]
};
