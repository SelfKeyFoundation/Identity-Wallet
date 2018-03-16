#!/bin/node
// ^^ just pray for now ^^
// #!/Users/altninja/.nvm/versions/node/v9.5.0/bin/node
// ^^ CHANGE PATH TO NODE IN ELECTRON APP BUILD ^^

const
	nativeMessage = require('./index')
	input = new nativeMessage.Input()
	transform = new nativeMessage.Transform(messageHandler)
	output = new nativeMessage.Output()
	data = [
		{
			"tag": true
		},
		{
			"id": "1",
			"pubKey": "abc123abc123abc123abc123abc123abc123"
		},
		{
			"id": "2",
			"pubKey": "def456def456def456def456def456def456"
		},
		{
			"id": "3",
			"pubKey": "ghi789ghi789ghi789ghi789ghi789ghi789"
		}
	]

// ** Pull Data from ID Wallet SQLite DB **

process.stdin
	.pipe(input)
	.pipe(transform)
	.pipe(output)
	.pipe(process.stdout)

function messageHandler(msg, push, done) {
	if (msg.all) {
		push(data)
		done()
	} else if (msg.single !== undefined) {
		push(data[msg.single])
		done()
	} else if (msg.submit) {
		push('success')
		done()
	} else {
		push('return: ' + msg)
		done()
	}
}
