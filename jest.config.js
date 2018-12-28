module.exports = {
	globalSetup: '<rootDir>/test/jest-setup.js',
	globalTeardown: '<rootDir>/test/jest-teardown.js',
	setupTestFrameworkScriptFile: '<rootDir>/test/jest-setup-test-framework.js',
	testPathIgnorePatterns: ['/node_modules/', '/dist/'],
	modulePaths: ['<rootDir>/src'],
	testMatch: ['**/src/**/*.spec.js', '**/src/**/*.steps.js'],
	verbose: true,
	testEnvironment: 'node',
	testURL: 'http://localhost/',
	collectCoverageFrom: ['src/{main,common}/**/*.js'],
	coverageReporters: ['json', 'lcov', 'text'],
	coveragePathIgnorePatterns: ['src/main/(seed|assets|migrations)'],
	coverageDirectory: 'dist/coverage',
	coverageThreshold: {}
};
