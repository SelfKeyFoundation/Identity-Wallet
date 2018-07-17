module.exports = {
	globalSetup: '<rootDir>/test/jest-setup.js',
	testPathIgnorePatterns: ['/node_modules/', 'test/e2e'],
	modulePaths: ['<rootDir>/src'],
	testRegex: '.spec.js$',
	verbose: true
};
