const builder = require('electron-builder')
Platform = builder.Platform

builder
	.build({
		targets: Platform.MAC.createTarget(),
		config: {
			'//': 'build options, see https://goo.gl/ZhRfla'
		}
	})
	.then(() => {
		// handle result
	})
	.catch(error => {
		// handle error
	})
