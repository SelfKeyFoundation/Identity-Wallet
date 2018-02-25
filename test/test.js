const slacker = require('./utils/slacker.js')
pwd = process.cwd()
Mocha = require('mocha')
fs = require('fs')
path = require('path')
tools = require('./utils/tools.js')
config = require('./config/config.js')

mocha = new Mocha({
	timeout: 10000,
	bail: true
})
testDir = pwd + '/test/e2e/_first/'

fs
	.readdirSync(testDir)
	.filter(file => {
		return file.substr(-3) === '.js'
	})
	.forEach(file => {
		mocha.addFile(path.join(testDir, file))
	})

slacker.quick({
	text: 'Test Run Start'
})

tools.consoleNotes()

mocha.run(failures => {
	process.on('exit', () => {
		slacker.quick({
			text: 'Test Run End'
		})
		process.exit(failures)
	})
	process.exit()
})
