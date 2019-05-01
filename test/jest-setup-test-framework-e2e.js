let testConfig = require('./config/config.js');
process.on('unhandledRejection', error => {
	// Will print "unhandledRejection err is not defined"
	console.log('unhandledRejection', error);
});

beforeAll(async () => {});

afterAll(async () => {});

testConfig.consoleNotes();
