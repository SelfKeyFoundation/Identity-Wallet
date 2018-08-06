process.env.MODE = 'test';
const Mocha = require('mocha');
const { walkSync } = require('../src/common/utils/fs');
const path = require('path');
const config = require('./config/config.js');
const exec = require('child_process').exec;

const TEST_FILE_RE = /\.spec\.js$/;

const MOCHA_CONF = {
	timeout: 20000,
	bail: true
};

const getTestType = () => {
	if (process.argv.length > 2 && process.argv[2] === 'e2e') {
		return 'e2e';
	}
	return 'unit';
};

const getTestDir = () => {
	if (getTestType() === 'unit') {
		return path.join(config.testDir, 'unit');
	}
	return path.join(config.testDir, 'e2e', 'basic_id');
};

const isTestFile = filename => TEST_FILE_RE.test(filename);

const getTestFiles = testDir => walkSync(testDir).filter(isTestFile);

const runChmod = () => {
	const chmodComplete = err => {
		if (err) {
			console.log('Error: ', err);
			return;
		}
		console.log('chmod worked');
	};
	exec(config.chmodCmd, chmodComplete);
};

const runTests = (files, complete) => {
	const mocha = new Mocha(MOCHA_CONF);
	files.forEach(file => mocha.addFile(file));
	config.consoleNotes();
	mocha.run(complete);
};

const handleTestsCompete = failures => {
	process.on('exit', () => {
		process.exit(failures);
	});
	process.exit();
};

const main = async () => {
	try {
		if (config.chmodCmd) {
			runChmod();
		}
		if (getTestType() === 'unit') {
			await require('./utils/db').init();
		}
		runTests(getTestFiles(getTestDir()), handleTestsCompete);
	} catch (error) {
		console.error(error);
	}
};

if (!module.parent) main();
