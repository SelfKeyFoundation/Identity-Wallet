module.exports = {
	globalSetup: '<rootDir>/test/jest-setup.js',
	globalTeardown: '<rootDir>/test/jest-teardown.js',
	setupTestFrameworkScriptFile: '<rootDir>/test/jest-setup-test-framework.js',
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	modulePaths: ['<rootDir>/src'],
	testMatch: ['**/test/e2e/**/*.spec.js', '**/test/e2e/**/*.steps.js'],
	verbose: true,
	testEnvironment: 'node',
	testURL: 'http://localhost/',
	collectCoverageFrom: ['src/{main,common}/**/*.js'],
	coverageReporters: ['json', 'lcov', 'text', 'html'],
	coveragePathIgnorePatterns: ['src/main/(seed|assets|migrations)'],
	coverageDirectory: 'dist/coverage',
	coverageThreshold: {}
};
