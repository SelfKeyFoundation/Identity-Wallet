const 
	Mocha = require('mocha')
	fs = require('fs')
	path = require('path')
	tools = require('./utils/tools.js')
	config = require('./config/config.js')

mocha = new Mocha({
	timeout: 15000,
	bail: true
})

fs.readdirSync(config.testDir)
	.filter(file => {
		return file.substr(-3) === '.js'
	})
	.forEach(file => {
		mocha.addFile(path.join(config.testDir, file))
	})

config.consoleNotes()
tools.init(() => {})
	.then(() => mocha.run(failures => {
	process.on('exit', () => {
		process.exit(failures)
	})
	process.exit()
}))