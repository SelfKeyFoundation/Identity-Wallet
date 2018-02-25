const 
	slacker = require('./utils/slacker.js')
	Mocha = require('mocha')
	fs = require('fs')
	path = require('path')
	tools = require('./utils/tools.js')
	config = require('./config/config.js')

mocha = new Mocha({
	timeout: 10000,
	bail: true
})

fs.readdirSync(config.testDir)
	.filter(file => {
		return file.substr(-3) === '.js'
	})
	.forEach(file => {
		mocha.addFile(path.join(config.testDir, file))
	})
// slacker.quick({text: 'Test Run Start'})
config.consoleNotes()
mocha.run(failures => {
	process.on('exit', () => {
		// slacker.quick({text: 'Test Run End'})
		process.exit(failures)
	})
	process.exit()
})
