process.env.MODE = 'test';
const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const tools = require('./utils/tools.js');
const config = require('./config/config.js');
const exec = require('child_process').exec;

let testType = 'unit';

if (process.argv.length > 2 && process.argv[2] == 'e2e') {
	testType = path.join(process.argv[2], 'basic_id');
}

if (config.chmodCmd) {
	exec(config.chmodCmd, err => (err ? console.log('Error: ', err) : console.log('chmod worked')));
}

mocha = new Mocha({
	timeout: 20000,
	bail: true
});

let dirFiles = walkSync(path.join(config.testDir, testType))
	.filter(file => path.extname(file) === '.js')
	.forEach(file => mocha.addFile(path.join(file)));

config.consoleNotes();

mocha.run(failures => {
	process.on('exit', () => {
		process.exit(failures);
	});
	process.exit();
});

function walkSync(dir, filelist = []) {
	fs.readdirSync(dir).forEach(file => {
		const dirFile = path.join(dir, file);
		try {
			filelist = walkSync(dirFile, filelist);
		} catch (err) {
			if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
			else throw err;
		}
	});
	return filelist;
}
