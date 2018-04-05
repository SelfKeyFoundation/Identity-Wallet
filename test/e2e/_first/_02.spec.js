const tools = require('../../utils/tools.js')

describe('Second Time Rejects the TOS and Exits', () => {
	before(tools.appStart)
	after(tools.appStop)
	// beforeEach(specStart)
	// afterEach(specStop)

	it('Rejects the TOS', () => {
		return tools.regStep(tools.app, '#doNotAgree')
	})

	it('Reconsiders and Returns to TOS', () => {
		return tools.regStep(tools.app, '#backToTOS')
	})

	it('Confirms Decision to Reject the TOS', () => {
		return tools.regStep(tools.app, '#doNotAgree')
	})

	it('Exits the App', () => {
		return tools.regStep(tools.app, '#exit')
	})
})
