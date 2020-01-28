require('./peer.min.js');

// TODO:  Get own DID to be used as id on for P2P
let id = 'did:selfkey:0xabc123';

// TODO: Get Process ID
let pid = '123456';

// TODO: Get Certifier DID
let cid = 'did:selfkey:0xdef456';

// TODO: Check these
const config = {
	host: process.env.SK_PEER_SERVER_HOST || 'localhost',
	port: process.env.SK_PEER_SERVER_PORT || 8888,
	path: '/selfkey'
};

const peer = new Peer(pid, config);

// TODO: Add conditionals for initiating connection
let conn = peer.connect(cid);

conn.on('open', () => {
	// TODO: Handle recieved data
	conn.on('data', data => {
		console.log('Received', data);
	});

	// TODO: Add conditionals to send data
	// TODO: Access SelfKey ID data
	conn.send('Hello!');
	// TODO: Add error handling
	// TODO: Add messages / statuses to send to UI
});
