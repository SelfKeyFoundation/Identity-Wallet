import _ from 'lodash';
import WebSocket from 'ws';
import Wallet from '../wallet/wallet';
import { checkPassword } from '../keystorage';
import { Logger } from 'common/logger';
import fetch from 'node-fetch';
import ethUtil from 'ethereumjs-util';
import fs from 'fs';
import path from 'path';
import https from 'https';
import child_process from 'child_process';
import sudo from 'sudo-prompt';
import common from 'common/utils/common';
import request from 'request';
import selfkey from 'selfkey.js';
import tcpPortUsed from 'tcp-port-used';

import pkg from '../../../package.json';

export const WS_ORIGINS_WHITELIST = process.env.WS_ORIGINS_WHITELIST
	? process.env.WS_ORIGINS_WHITELIST.split(',')
	: ['chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik','chrome-extension://fmmadhehohahcpnjjkbdajimilceilcd'];

export const WS_IP_WHITELIST = process.env.WS_IP_WHITELIST
	? process.env.WS_IP_WHITELIST.split(',')
	: ['127.0.0.1', '::1'];

export const WS_PORT = process.env.LWS_WS_PORT || 8898;
export const WSS_PORT = process.env.LWS_WSS_PORT || 8899;

export const userAgent = `SelfKeyIDW/${pkg.version}`;

const log = new Logger('LWSService');

const currentOS = process.platform;
const userDataPath = common.getUserDataPath();

function init() {
	return new Promise((resolve, reject) => {
		try {
			
			let macos = {
				lwsPath: path.join(userDataPath, '/lws/'),
				lwsKeyPath: path.join(userDataPath, '/lws/keys/'),
				reqFile: path.join(userDataPath, '/lws/keys/lws_cert.pem'),
				rsaFile: path.join(userDataPath, '/lws/keys/lws_key.pem'),
				keyTempFile: path.join(userDataPath, '/lws/keys/keytemp.pem'),
				certgen: null
			}

			macos.certgen = [
				{
					cmd:`openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -subj "/C=NV/ST=SK/L=Nevis/O=selfkey/CN=localhost" -extensions EXT -config <( printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth") -keyout "${macos.keyTempFile}" -out "${macos.reqFile}"`,
					options: {
						shell: '/bin/bash'
					},
					type: 'child'
				},
				{
					cmd: `openssl rsa -in "${macos.keyTempFile}" -out "${macos.rsaFile}"`,
					options: {
						"shell": "/bin/bash"
					},
					type: 'child'
				},
				{
					cmd: `security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "${macos.reqFile}"`,
					options: {
						name:
							'SelfKey needs to install a security certifcate to encrypt data and'
					},
					type: 'sudo'
				}
			]
	
			let linux = {
				lwsPath: path.join(userDataPath, '/lws/'),
				lwsKeyPath: path.join(userDataPath, '/lws/keys/'),
				reqFile: path.join(userDataPath, '/lws/keys/lws_cert.pem'),
				rsaFile: path.join(userDataPath, '/lws/keys/lws_key.pem'),
				keyTempFile: path.join(userDataPath, '/lws/keys/keytemp.pem'),
				certgen: []
			}

			linux.certgen = [
				{
					cmd: `openssl req \
						-new \
						-newkey rsa:2048 \
						-days 365 \
						-nodes \
						-x509 \
						-subj "/C=NV/ST=SK/L=Nevis/O=selfkey/CN=localhost" \
						-extensions EXT \
						-config <( printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth") \
						-keyout ${linux.keyTempFile} \
						-out ${linux.reqFile}`,
					options: {
						shell: '/bin/bash'
					},
					type: 'child'
				},
				{
					cmd: `openssl rsa -in ${linux.keyTempFile} -out ${linux.rsaFile}`,
					options: {
						shell: '/bin/bash'
					},
					type: 'child'
				}
			]

			let windows = {
				certgen: [
					{
						cmd:
							'New-SelfSignedCertificate -Type Custom -Subject "C=NV,ST=SK,L=Nevis,O=selfkey,CN=localhost" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1") -DnsName "localhost" -KeyUsage DigitalSignature -KeyAlgorithm RSA -KeyLength 2048 -CertStoreLocation "Cert:CurrentUser\\My"',
						options: {},
						type: 'power'
					}
				]
			}

			switch (currentOS) {
				case 'darwin':
					resolve(macos);
				case 'linux':
					resolve(linux);
				case 'win32':
					resolve(windows);
			}

		} catch (e) {
			reject(e);
		}
	});
}

function checkPort(port) {
	return new Promise((resolve, reject) => {
		tcpPortUsed.check(port, '127.0.0.1').then(check => {
			log.info(check)
			resolve(check)
		}, err => {
			reject(console.error('Error on check:', err.message))
		});
	})
}


function executor(cmd, options) {
	console.log('norm: ', cmd, options)	
	return new Promise((resolve, reject) => {
		try {
			child_process.exec(cmd, options, (error, stdout, stderr) => {
				resolve(console.log('norm cmd done'))
			});
		} catch (e) {
			reject(console.log('Error++: ' + e))
		}
	})
}

function sudocutor(cmd, options) {
	console.log('sudo: ', cmd, options)	
	return new Promise((resolve, reject) => {
		try {
			sudo.exec(cmd, options, (error, stdout, stderr) => {
				// TODO: Handle no permission error better
				resolve(console.log('sudo cmd done'))
			});
		} catch (e) {
			reject(console.log('Error++: ' + e))
		}
	})
}

function windocutor(cmd, options) {
	return new Promise((resolve, reject) => {
		if (currentOS === 'win32' || 'win64') {
			const powerShell = require('node-powershell');
			let ps = new powerShell({
				executionPolicy: 'Bypass',
				noProfile: true
			});
			ps.addCommand(cmd);
			ps.invoke()
				.then(output => resolve(output))
				.catch(err => {
					ps.dispose();
					reject(console.error(err));
				});
		} else {
			reject(false)
		}
	});
}

function checkDirs(config) {
	return new Promise((resolve, reject) => {
		let lwsPathCheck = fs.existsSync(config.lwsPath);
		if (!lwsPathCheck) {
			fs.mkdirSync(config.lwsPath);
			let lwsKeyPathCheck = fs.existsSync(config.lwsKeyPath);
			if (!lwsKeyPathCheck) {
				fs.mkdirSync(config.lwsKeyPath);
			}
		}
		resolve(true);
	});
}

function checkKeys(config) {
	return new Promise((resolve, reject) => {
		let reqFileCheck = fs.existsSync(config.reqFile);
		let rsaFileCheck = fs.existsSync(config.rsaFile);
		if (reqFileCheck && rsaFileCheck) {
			resolve(true);
		} else {
			resolve(false);
		}
	});
}

async function runCertgen(config) {
	try {
		for (let run of config.certgen) {
			if (run.type === 'sudo')
				await sudocutor(run.cmd, run.options)
			else if (run.type === 'windows')
				await windocutor(run.cmd, run.options)
			else 
				await executor(run.cmd, run.options)
		}
		return true
	} catch (e) {
		return e
	}
}

async function certs(config) {
	return new Promise((resolve, reject) => {
		try {
			checkDirs(config).then(dirs => {
				checkKeys(config).then(keys => {
					if (!keys) {
						resolve(runCertgen(config))
					} else {
						resolve(true)
					}
				})
			})
		} catch (e) {
			reject(e);
		}
	})
}

export class LWSService {
	
	constructor({ rpcHandler }) {
		this.wss = null;
		this.rpcHandler = rpcHandler;
	}

	checkWallet(publicKey, conn) {
		const res = { publicKey, unlocked: false };
		const privateKey = conn.getUnlockedWallet(publicKey);
		if (!privateKey) return res;
		return { ...res, unlocked: true, privateKey };
	}

	async reqWallets(msg, conn) {
		const { website } = msg.payload;
		let payload = await Wallet.findAll();
		payload = await Promise.all(
			payload.map(async w => {
				let checked = this.checkWallet(w.publicKey, conn);
				let signedUp = await w.hasSignedUpTo(website.url);
				return {
					publicKey: w.publicKey,
					unlocked: checked.unlocked,
					profile: w.profile,
					signedUp
				};
			})
		);
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
		payload.profile = wallet.profile;
		payload.signedUp = await wallet.hasSignedUpTo(msg.payload.website.url);
		conn.send(
			{
				payload
			},
			msg
		);
	}

	async getAttributes(publicKey, attributes) {
		let attributesMapByKey = attributes.reduce(
			(acc, curr) => ({ ...acc, [curr.key]: curr }),
			{}
		);
		let wallet = await Wallet.findByPublicKey(publicKey).eager('idAttributes');
		let walletAttrs = wallet.idAttributes.filter(attr => attr.type in attributesMapByKey);

		walletAttrs = await Promise.all(
			walletAttrs.map(async attr => {
				if (!attr.hasDocument()) {
					return attr;
				}
				let docValue = await attr.loadDocumentDataUrl();
				return { ...attr, data: { value: docValue }, document: true };
			})
		);
		return walletAttrs.map(attr => ({
			key: attributesMapByKey[attr.type].key,
			label: attributesMapByKey[attr.type].label,
			document: !!attr.document,
			data: attr.data
		}));
	}

	async reqAttributes(msg, conn) {
		try {
			const check = this.checkWallet(msg.payload.publicKey, conn);
			if (!check.unlocked) {
				return conn.send(
					{
						error: true,
						payload: {
							code: 'not_authorized',
							message: 'Wallet is locked, cannot request attributes'
						}
					},
					msg
				);
			}
			const payload = await this.getAttributes(msg.payload.publicKey, msg.payload.attributes);
			conn.send({ payload }, msg);
		} catch (error) {
			conn.send(
				{
					error: true,
					payload: {
						code: 'attributes_error',
						message: error.message
					}
				},
				msg
			);
		}
	}

	async fetchNonce(url) {
		try {
			const resp = await fetch(url, {
				headers: { Accept: 'application/json', 'User-Agent': userAgent }
			});
			return resp.json();
		} catch (error) {
			return {
				error: 'connection error'
			};
		}
	}

	async reqAuth(msg, conn) {
		
		try {
			
			let check = this.checkWallet(msg.payload.publicKey, conn);
			
			if (!check.unlocked) {
				return this.authResp(
					{
						error: true,
						payload: {
							code: 'auth_error',
							message: 'Cannot auth with locked wallet'
						}
					},
					msg,
					conn
				);
			}
			
			const nonceResp = await this.fetchNonce(msg.payload.website.apiUrl);
			
			if (nonceResp.error || !nonceResp.nonce) {
				return this.authResp(
					{
						error: true,
						payload: {
							code: 'nonce_fetch_error',
							message: nonceResp.error || 'No nonce in response'
						}
					},
					msg,
					conn
				);
			}

			const pk = await conn.getUnlockedWallet(msg.payload.publicKey);
			const signature = await selfkey.createSignature(nonceResp.nonce, pk)

			if (!signature) {
				return this.authResp(
					{
						error: true,
						payload: {
							code: 'sign_error',
							message: 'Could not generate signature'
						}
					},
					msg,
					conn
				);
			}

			let form = {
				publicKey: msg.payload.publicKey,
				nonce: nonceResp.nonce,
				signature: signature
			};

			if (msg.payload.attributes) {
				form.attributes = JSON.stringify(msg.payload.attributes);
			}

			const options = {
				url: msg.payload.website.apiUrl,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'User-Agent': userAgent
				},
				form: form
			};

			request.post(options, (err, resp, body) => {
				
				let lwsResp = {}
				
				try {
					lwsResp = {
						payload: JSON.parse(body)
					};
				} catch(e) {
					lwsResp = {
						payload: e
					};
				}

				if (err) {
					lwsResp.error = true;
					lwsResp.payload = {
						code: resp.statusCode,
						message: resp
					};
				}
				
				// if (body.token) {
				// TODO: mark wallet signed up to website
				// }
				
				conn.send(lwsResp, msg);
			});
		
		} catch (error) {
			return this.authResp(
				{
					payload: {
						code: 'conn_error',
						message: error.message
					},
					error: true
				},
				msg,
				conn
			);
		}
	}

	async authResp(resp, msg, conn) {
		let { publicKey } = msg.payload || {};
		let wallet = await Wallet.findByPublicKey(publicKey);
		let attempt = this.formatLoginAttempt(msg, resp);
		await wallet.addLoginAttempt(attempt);
		if (this.rpcHandler) {
			await this.rpcHandler.actionLogs_add(
				'ON_RPC',
				'',
				'actionLogs_add',
				this.formatActionLog(wallet, attempt)
			);
		}
		return conn.send(resp, msg);
	}

	formatLoginAttempt(msg, resp) {
		let { website, attributes = [] } = msg.payload || {};
		let attempt = {
			websiteName: website.name,
			websiteUrl: website.url,
			apiUrl: website.apiUrl,
			signup: attributes.length > 0,
			success: true,
			errorCode: null,
			errorMessage: null
		};
		if (resp.error) {
			attempt.success = false;
			attempt.errorCode = resp.payload.code;
			attempt.errorMessage = resp.payload.message || 'Unknown Error';
		}
		return attempt;
	}

	formatActionLog(wallet, loginAttempt) {
		let title = `Login to ${loginAttempt.websiteUrl}`;
		let content;

		if (loginAttempt.signup) {
			title = `Signup to ${loginAttempt.websiteUrl}`;
		}

		if (loginAttempt.errorCode) {
			content = `${title} has failed`;
		} else {
			content = `${title} was successful`;
		}

		return { walletId: wallet.id, title, content };
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

	async handleSecureRequest(msg, conn) {
		log.info('lws req %2j', msg);
		switch (msg.type) {
			case 'wallets':
				return this.reqWallets(msg, conn);
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

	async handleRequest(msg, conn) {
		log.info('lws req %2j', msg);
		switch (msg.type) {
			case 'init':
				return this.startSecureServer(msg, conn);
			default:
				return this.reqUnknown(msg, conn);
		}
	}

	handleConn(conn) {
		log.info('ws connection established');
		let wsConn = new WSConnection(conn, this);
		wsConn.listen();
	}

	handleSecureConn(conn) {
		log.info('wss connection established');
		let wsConn = new WSConnection(conn, this, true);
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
		this.wss = new WebSocket.Server({
			port: WS_PORT,
			verifyClient: this.verifyClient.bind(this)
		});
		this.wss.on('connection', this.handleConn.bind(this));
		this.wss.on('error', err => log.error(err));
	}

	async startSecureServer(msg, conn) {
		const config = await init()
		const serverExists = await checkPort(WSS_PORT)
		if (!serverExists) {
			// TODO: trigger modal here and wait for user accept then
			log.info('starting wss');
			conn.send(
				{
					payload: { message: 'starting secure ws server' }
				},
				msg
			);
			certs(config).then(status => {
				if (status) {	
					const httpsServer = new https.createServer({
						cert: fs.readFileSync(config.reqFile),
						key: fs.readFileSync(config.rsaFile)
					});
					const wss = new WebSocket.Server({
						server: httpsServer
					})
					.on('connection', this.handleSecureConn.bind(this))
					.on('error', err => log.error(err));
					httpsServer.listen(WSS_PORT, () => console.log('wss listening on port ' + WSS_PORT))
					log.info('secure wss server started');
				} else {
					log.info('error starting wss');
				}
			})
		} else {
			log.info('wss already started')
		}
	}

}

export class WSConnection {
	constructor(conn, service, wss) {
		this.conn = conn;
		this.service = service;
		this.msgId = 0;
		this.ctx = {
			unlockedWallets: {}
		};
		if (wss) {
			this.wssStatus = wss;
		}
	}

	unlockWallet(publicKey, privateKey) {
		this.ctx.unlockedWallets[publicKey] = privateKey;
	}

	getUnlockedWallet(publicKey) {
		return this.ctx.unlockedWallets[publicKey] || null;
	}

	async handleMessage(msg) {
		try {
			msg = JSON.parse(msg);
			if (this.wssStatus) {
				await this.service.handleSecureRequest(msg, this);
			} else {
				await this.service.handleRequest(msg, this);
			}
		} catch (error) {
			log.error(error);
			msg = typeof msg === 'string' ? {} : msg;
			this.send(
				{ error: true, payload: { code: 'invalid_message', message: 'Invalid Message' } },
				msg
			);
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
		msg = msg || {};
		msg = { ...msg };
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
		log.info('lws resp %2j', msg);
		this.conn.send(JSON.stringify(msg));
	}
}
