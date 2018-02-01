const 
	Application = require('spectron').Application
	assert = require('assert')
	pwd = process.cwd()
	APP_TITLE = require('../package.json').config.forge.electronPackagerConfig.name
	appPath = pwd + '/out/' + APP_TITLE + '-darwin-x64/' + APP_TITLE + '.app/Contents/MacOS/' + APP_TITLE

describe('Application launch', () => {
	
	beforeEach(() => {
		this.app = new Application({
			path: appPath
		})
		return this.app.start()
		done()
	})

	afterEach(() => {
		if (this.app && this.app.isRunning()) {
			return this.app.stop()
		}
		done()
	})

	it('shows an initial window', () => {
		return this.app.client.getWindowCount().then( count => {
			assert.equal(count, 1)
		})
		done()
	})
})
