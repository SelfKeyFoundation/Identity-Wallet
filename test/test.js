process.env.MODE = 'test';
const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const tools = require('./utils/tools.js');
const config = require('./config/config.js');
const exec = require('child_process').exec;

if (config.chmodCmd) {
	exec(config.chmodCmd, err => (err ? console.log('Error: ', err) : console.log('chmod worked')));
}

mocha = new Mocha({
	timeout: 20000,
	bail: true
});

fs.readdirSync(config.testDir)
	.filter(file => {
		return file.substr(-3) === '.js';
	})
	.forEach(file => mocha.addFile(path.join(config.testDir, file)));

config.consoleNotes();

mocha.run(failures => {
	process.on('exit', () => {
		process.exit(failures);
	});
	process.exit();
});
