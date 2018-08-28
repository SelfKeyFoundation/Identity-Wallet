import _ from 'lodash';
import WebSocket from 'ws';
import Wallet from '../wallet/wallet';
import { checkPassword } from '../keystorage';
import { Logger } from 'common/logger';
import { IdAttribute } from '../identity/id-attribute';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import ethUtil from 'ethereumjs-util';
import fs from 'fs';
import https from 'https';
import child_process from 'child_process';
import sudo from 'sudo-prompt';
import common from 'common/utils/common';

export const WS_ORIGINS_WHITELIST = ['chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik'];
export const WS_IP_WHITELIST = ['127.0.0.1', '::1'];
export const WS_PORT = process.env.LWS_WS_PORT || 8898;

const log = new Logger('LWSService');
const userDataPath = common.getUserDataPath();

let reqFile = userDataPath + '/lws/keys/lws_cert.pem';
let rsaFile = userDataPath + '/lws/keys/lws_key.pem';
let keyTempFile = userDataPath + '/lws/keys/keytemp.pem';

function listenForLWS() {
	// listens for LWS
	// triggers user prompt for secure websockets setup
}

function keyDirs() {
	// setup dirs for keys
	return new Promise((resolve, reject) => {
		let lwsPath = fs.existsSync(userDataPath + '/lws/');
		let lwsKeyPath = fs.existsSync(userDataPath + '/lws/keys');
		if (!lwsPath) {
			fs.mkdirSync(userDataPath + '/lws/');
		}
		if (!lwsKeyPath) {
			fs.mkdirSync(userDataPath + '/lws/keys');
		}
		resolve('done');
	});
}

function createREQCert() {
	return new Promise((resolve, reject) => {
		let reqCommand =
			'openssl req \
			-new \
			-newkey rsa:4096 \
			-days 365 \
			-nodes \
			-x509 \
			-subj "/C=NV/ST=SK/L=Nevis/O=selfkey/CN=localhost" \
			-extensions EXT \
			-config <( printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth") \
			-keyout "' +
			keyTempFile +
			'" \
			-out "' +
			reqFile +
			'"';
		child_process.exec(reqCommand, { shell: '/bin/bash' }, (error, stdout, stderr) => {
			if (error) throw error;
			resolve('done');
		});
	});
}

function createRSAKey() {
	return new Promise((resolve, reject) => {
		let rsaCommand = 'openssl rsa \
			-in "' + keyTempFile + '" \
			-out "' + rsaFile + '"';
		child_process.exec(rsaCommand, { shell: '/bin/bash' }, (error, stdout, stderr) => {
			if (error) throw error;
			resolve('done');
		});
	});
}

function addTrustedCert() {
	return new Promise((resolve, reject) => {
		// add the certificate to the users system keychain - prompt the user for password
		let sudoOptions = {
			name: 'SelfKey needs to install a security certifcate to encrypt data and'
		};
		let sudoCommand =
			'security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "' +
			reqFile +
			'"';
		sudo.exec(sudoCommand, sudoOptions, (error, stdout, stderr) => {
			// TODO: Handle no permission error better
			if (error) resolve('ws');
			resolve('wss');
		});
	});
}

// Secure WebSocket Setup
function createWSCerts() {
	return new Promise((resolve, reject) => {
		log.info(userDataPath);
		let currentOS = process.platform;
		// IF OSX
		if (currentOS === 'darwin') {
			// check if key files exist
			let reqFileCheck = fs.existsSync(reqFile);
			let rsaFileCheck = fs.existsSync(rsaFile);
			if (reqFileCheck && rsaFileCheck) {
				resolve('wss');
			} else {
				keyDirs().then(() =>
					createREQCert().then(() =>
						createRSAKey().then(() =>
							addTrustedCert().then(status => {
								resolve(status);
							})
						)
					)
				);
			}
			// IF NOT OSX
		} else {
			// will start non-TLS WebSocket server
			resolve('ws');
		}
	});
}

export class LWSService {
	constructor() {
		this.wss = null;
	}

	checkWallet(publicKey, conn) {
		const res = { publicKey, unlocked: false };
		const privateKey = conn.getUnlockedWallet(publicKey);
		if (!privateKey) return res;
		return { ...res, unlocked: true, privateKey };
	}

	async reqWallets(msg, conn) {
		let payload = await Wallet.findAll();
		payload = payload.map(w => {
			let checked = this.checkWallet(w.publicKey, conn);
			return {
				id: w.id,
				publicKey: w.publicKey,
				unlocked: checked.unlocked
			};
		});
		conn.send(
			{
				payload
			},
			msg
		);
	}

	async reqWallet(msg, conn) {
		const checked = this.checkWallet(msg.payload.publicKey, conn);
		const payload = _.pick(checked, 'publicKey', 'unlocked');
		conn.send(
			{
				payload
			},
			msg
		);
	}

	async reqUnlock(msg, conn) {
		let wallet = await Wallet.findByPublicKey(msg.payload.publicKey);
		const privateKey = checkPassword(wallet, msg.payload.password);
		if (privateKey) {
			conn.unlockWallet(msg.payload.publicKey, privateKey);
		}
		let payload = _.pick(
			this.checkWallet(msg.payload.publicKey, conn),
			'publicKey',
			'unlocked'
		);
		conn.send(
			{
				payload
			},
			msg
		);
	}

	async getAttributes(wid, required) {
		let requiredMapByKey = required.reduce((acc, curr) => ({ ...acc, [curr.key]: curr }), {});
		let walletAttrs = await IdAttribute.findAllByWalletId(wid).whereIn(
			'type',
			required.map(r => r.key)
		);
		walletAttrs = await Promise.all(
			walletAttrs.map(async attr => {
				if (!attr.hasDocument()) {
					return attr;
				}
				let docValue = await attr.loadDocumentDataUrl();
				return { ...attr, data: docValue };
			})
		);
		return walletAttrs.map(attr => ({
			key: requiredMapByKey[attr.type].key,
			label: requiredMapByKey[attr.type].label,
			attribute: attr.data.value ? attr.data.value : attr.data
		}));
	}

	async reqAttributes(msg, conn) {
		try {
			conn.send(
				{
					payload: await this.getAttributes(msg.payload.publicKey, msg.payload.required)
				},
				msg
			);
		} catch (error) {
			conn.send(
				{
					error: error.message
				},
				msg
			);
		}
	}

	async genSignature(nonce, publicKey, conn) {
		const privateKey = this.checkWallet(publicKey, conn);
		const msgHash = ethUtil.hashPersonalMessage(Buffer.from(nonce, 'hex'));
		const signature = ethUtil.ecsign(msgHash, Buffer.from(privateKey, 'hex'));
		return signature;
	}

	async fetchNonce(url) {
		const resp = await fetch(url);

		if (resp.status >= 300) {
			throw new Error(`error, status ${resp.status} - ${resp.statusresp.text()}`);
		}
		return resp.text();
	}

	async reqAuth(msg, conn) {
		try {
			const nonce = await this.fetchNonce(msg.payload.nonce_url);
			const params = new URLSearchParams();

			params.add('publicKey', msg.payload.publicKey);
			params.append('nonce', nonce);
			params.append('signature', this.genSignature(nonce, msg.payload.publicKey, conn));

			let resp = await fetch(msg.payload.auth_url, { method: 'POST', body: params });
			conn.send(
				{
					payload: { message: resp.text() }
				},
				msg
			);
		} catch (error) {
			conn.send(
				{
					error: error.message
				},
				msg
			);
		}
	}

	reqUnknown(msg, conn) {
		log.error('unknown request %s', msg.type);
		conn.send(
			{
				error: 'unknown request'
			},
			msg
		);
	}

	async handleRequest(msg, conn) {
		log.debug('ws type %2j', msg);
		switch (msg.type) {
			case 'wallets':
				return this.reqWallets(msg, conn);
			case 'wallet':
				return this.reqWallet(msg, conn);
			case 'unlock':
				return this.reqUnlock(msg, conn);
			case 'attributes':
				return this.reqAttributes(msg, conn);
			case 'auth':
				return this.reqAuth(msg, conn);
			default:
				return this.reqUnknown(msg, conn);
		}
	}

	handleConn(conn) {
		log.info('ws connection established');
		let wsConn = new WSConnection(conn, this);
		wsConn.listen();
	}

	verifyClient(info) {
		const clientIp = info.req.connection.remoteAddress;
		const clientOrigin = info.req.headers.origin;
		if (!WS_IP_WHITELIST.includes(clientIp) || !WS_ORIGINS_WHITELIST.includes(clientOrigin)) {
			log.info(`rejecting ws from ip:${clientIp} origin:${clientOrigin}`);
			return false;
		}
		log.info(`accepting ws from ip:${clientIp} origin:${clientOrigin}`);
		return true;
	}

	startServer() {
		createWSCerts().then(status => {
			if (status === 'wss') {
				const httpsServer = new https.createServer({
					cert: fs.readFileSync(reqFile),
					key: fs.readFileSync(rsaFile)
				});
				this.wss = new WebSocket.Server({ server: httpsServer });
				this.wss.on('connection', this.handleConn.bind(this));
				this.wss.on('error', err => log.error(err));
				httpsServer.listen(WS_PORT);
			} else {
				this.wss = new WebSocket.Server({
					port: WS_PORT,
					verifyClient: this.verifyClient.bind(this)
				});
				this.wss.on('connection', this.handleConn.bind(this));
				this.wss.on('error', err => log.error(err));
			}
		});
	}
}

export class WSConnection {
	constructor(conn, service) {
		this.conn = conn;
		this.service = service;
		this.msgId = 0;
		this.ctx = {
			unlockedWallets: {}
		};
	}

	unlockWallet(publicKey, privateKey) {
		this.ctx.unlockedWallets[publicKey] = privateKey;
	}

	getUnlockedWallet(publicKey) {
		return this.ctx.unlockedWallets[publicKey];
	}

	async handleMessage(msg) {
		try {
			msg = JSON.parse(msg);
			await this.service.handleRequest(msg, this);
		} catch (error) {
			log.error(error);
			this.send({ error: 'invalid message' }, msg);
		}
	}

	listen() {
		this.conn.on('message', this.handleMessage.bind(this));
		this.conn.on('error', err => log.error(err));
	}

	send(msg, req) {
		if (!this.conn) {
			log.error('cannot send message, no connection');
			return;
		}
		req = req || {};
		msg.type = msg.type || req.type;
		msg.meta = msg.meta || {};
		let id = msg.meta.id;
		if (!id && req.meta && req.meta.id) {
			id = req.meta.id;
		}
		msg.meta.id = id || `idw_${this.msgId++}`;
		msg.meta.src = msg.meta.src || 'idw';
		if (!msg.type && msg.error) {
			msg.type = 'error';
		}
		this.conn.send(JSON.stringify(msg));
	}
}
