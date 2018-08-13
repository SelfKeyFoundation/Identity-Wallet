module.exports = {
	globalSetup: '<rootDir>/test/jest-setup.js',
	testPathIgnorePatterns: ['/node_modules/', 'test/e2e'],
	modulePaths: ['<rootDir>/src'],
	testRegex: '.spec.js$',
	verbose: true,
	testEnvironment: 'node',
	testURL: 'http://localhost/',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.js'],
	coverageReporters: ['json', 'lcov', 'text', 'html'],
	coveragePathIgnorePatterns: ['src/main/(seed|assets|migrations)'],
	coverageDirectory: 'dist/coverage',
	coverageThreshold: {}
};
