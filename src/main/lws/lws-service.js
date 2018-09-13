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

const currentOS = process.platform;

if (currentOS === 'win32' || 'win64') {
	const powerShell = require('node-powershell');
	let ps = new powerShell({
		executionPolicy: 'Bypass',
		noProfile: true
	});
}

import pkg from '../../../package.json';

export const WS_ORIGINS_WHITELIST = process.env.WS_ORIGINS_WHITELIST
	? process.env.WS_ORIGINS_WHITELIST.split(',')
	: ['chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik'];
export const WS_IP_WHITELIST = process.env.WS_IP_WHITELIST
	? process.env.WS_IP_WHITELIST.split(',')
	: ['127.0.0.1', '::1'];
export const WS_PORT = process.env.LWS_WS_PORT || 8898;

export const userAgent = `SelfKeyIDW/${pkg.version}`;

const log = new Logger('LWSService');

const userDataPath = common.getUserDataPath();

function init() {
	return new Promise((resolve, reject) => {
		try {
			let osxConfig = {
				lwsPath: path.join(userDataPath, '/lws/'),
				lwsKeyPath: path.join(userDataPath, '/lws/keys'),
				reqFile: path.join(userDataPath, '/lws/keys/lws_cert.pem'),
				rsaFile: path.join(userDataPath, '/lws/keys/lws_key.pem'),
				keyTempFile: path.join(userDataPath, '/lws/keys/keytemp.pem'),
				certgen: [
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
							-keyout ${keyTempFile} \
							-out ${reqFile}`,
						options: {
							shell: '/bin/bash'
						},
						type: 'child'
					},
					{
						cmd: `openssl rsa -in ${keyTempFile} -out ${rsaFile}`,
						options: {
							shell: '/bin/bash'
						},
						type: 'child'
					},
					{
						cmd:
							`security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${reqFile}`,
						options: {
							name:
								'SelfKey needs to install a security certifcate to encrypt data and'
						},
						type: 'sudo'
					}
				]
			};
			let linConfig = {
				lwsPath: path.join(userDataPath, '/lws/'),
				lwsKeyPath: path.join(userDataPath, '/lws/keys'),
				reqFile: path.join(userDataPath, '/lws/keys/lws_cert.pem'),
				rsaFile: path.join(userDataPath, '/lws/keys/lws_key.pem'),
				keyTempFile: path.join(userDataPath, '/lws/keys/keytemp.pem'),
				certgen: [
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
							-keyout ${keyTempFile} \
							-out ${reqFile}`,
						options: {
							shell: '/bin/bash'
						},
						type: 'child'
					},
					{
						cmd: `openssl rsa -in ${keyTempFile} -out ${rsaFile}`,
						options: {
							shell: '/bin/bash'
						},
						type: 'child'
					}
				]
			};
			let winConfig = {
				lwsPath: path.join(userDataPath, '\\lws\\'),
				lwsKeyPath: path.join(userDataPath, '\\lws\\keys'),
				reqFile: path.join(userDataPath, '\\lws\\keys\\lws_cert.pem'),
				rsaFile: path.join(userDataPath, '\\lws\\keys\\lws_key.pem'),
				keyTempFile: path.join(userDataPath, '\\lws\\keys\\keytemp.pem'),
				certgen: [
					{
						cmd:
							'New-SelfSignedCertificate -Type Custom -Subject "C=NV,ST=SK,L=Nevis,O=selfkey,CN=localhost" -TextExtension @("CN=localhost,[req]distinguished_name=[EXT]subjectAltName=DNS:localhost,keyUsage=digitalSignature,extendedKeyUsage=serverAuth") -KeyUsage DigitalSignature -KeyAlgorithm RSA -KeyLength 2048 -CertStoreLocation "Cert:CurrentUserMy"',
						options: {},
						type: 'power'
					}
				]
			};
			switch (currentOS) {
				case 'darwin':
					return resolve(osxConfig);
				case 'linux':
					return resolve(linConfig);
				case 'win32':
					return resolve(winConfig);
				default:
					return resolve(osxConfig);
			}
		} catch (e) {
			return reject(e);
		}
	});
}

function executor(cmd, options) {
	return new Promise((resolve, reject) => {
		child_process.exec(cmd, options, (error, stdout, stderr) => {
			if (error) reject(error);
			resolve('done');
		});
	});
}

function sudocutor(cmd, options) {
	return new Promise((resolve, reject) => {
		sudo.exec(cmd, options, (error, stdout, stderr) => {
			// TODO: Handle no permission error better
			if (error) resolve('ws');
			resolve('wss');
		});
	});
}

function windocutor(cmd, options) {
	return new Promise((resolve, reject) => {
		ps.addCommand(cmd);
		ps.invoke()
			.then(output => resolve(output))
			.catch(err => {
				ps.dispose();
				reject(log.error(err));
			});
	});
}

function checkDirs(config) {
	return new Promise((resolve, reject) => {
		let lwsPathCheck = fs.existsSync(config.lwsPath);
		let lwsKeyPathCheck = fs.existsSync(config.lwsKeyPath);
		if (!lwsPath) {
			fs.mkdirSync(config.lwsPath);
		}
		if (!lwsKeyPath) {
			fs.mkdirSync(config.lwsPath);
		}
		resolve('done');
	});
}

function checkKeys(config) {
	return new Promise((resolve, reject) => {
		let reqFileCheck = fs.existsSync(config.reqFile);
		let rsaFileCheck = fs.existsSync(config.rsaFile);
		if (reqFileCheck && rsaFileCheck) {
			resolve('wss');
		} else {
			resolve('ws');
		}
	});
}

function runCertgen(config) {
	return new Promise((resolve, reject) => {
		let steps = [];
		for (let step of config.certgen) {
			switch (step.type) {
				case 'child':
					steps.push(executor(step.cmd, step.options));
				case 'sudo':
					steps.push(sudocutor(step.cmd, step.options));
				case 'power':
					steps.push(windocutor(step.cmd));
				default:
					steps.push(executor(step.cmd, step.options));
			}
		}
		resolve(Promise.all(steps));
	});
}

function certs(config) {
	return new Promise((resolve, reject) => {
		try {
			checkDirs(config).then(checkDirs => {
				if (checkDirs === 'done') {
					checkKeys(config).then(status => {
						if (status !== 'wss') {
							runCertgen(config).then(() => resolve('done'));
						}
					});
				} else {
					resolve('done');
				}
			});
		} catch (e) {
			resolve(e);
		}
	});
}

// start standard WS server with ability to only accept init message upon recieving init message attempt to create certificate
// borwser extension needs logic to change to wss and check port

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
			// TODO: check if wallet has signed up to msg.payload.website
			let checked = this.checkWallet(w.publicKey, conn);
			return {
				publicKey: w.publicKey,
				unlocked: checked.unlocked,
				profile: w.profile
			};
		});
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

	async genSignature(nonce, publicKey, conn) {
		const privateKey = this.checkWallet(publicKey, conn);
		const msgHash = ethUtil.hashPersonalMessage(Buffer.from(nonce, 'hex'));
		const signature = ethUtil.ecsign(msgHash, Buffer.from(privateKey, 'hex'));
		return signature;
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
			const nonceResp = await this.fetchNonce(msg.payload.website.apiUrl);
			if (nonceResp.error) {
				return conn.send(
					{
						error: true,
						payload: {
							code: 'nonce_fetch_error',
							message: nonceResp.error
						}
					},
					msg
				);
			}

			const pk = await conn.getUnlockedWallet(msg.payload.publicKey);
			const signature = await ethUtil.ecsign(ethUtil.hashPersonalMessage(Buffer.from(nonceResp.nonce, 'hex')), Buffer.from(pk, 'hex'));
			
			let form = {
				pubKey: msg.payload.publicKey,
				nonce: nonceResp.nonce,
				signature: JSON.stringify(signature)
			};

			if (msg.payload.attributes) {
				form.attributes = JSON.stringify(msg.payload.attributes);
			}

			// let finalForm = LZUTF8.compress(JSON.stringify(form, {outputEncoding: 'Buffer'}));
			// console.log(finalForm)

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
				let lwsResp = {
					payload: JSON.parse(body)
				};
				if (err) {
					lwsResp.error = true;
					lwsResp.payload = {
						code: lwsResp.code,
						message: lwsResp.error
					};
				}
				// if (body.token) {
					// TODO: mark wallet signed up to website
				// }
				conn.send(lwsResp, msg);
			});

			// let resp = await fetch(msg.payload.website.apiUrl, {
			// 	method: 'POST',
			// 	body,
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		Accept: 'application/json',
			// 		'User-Agent': userAgent
			// 	}
			// });

		} catch (error) {
			conn.send(
				{
					payload: {
						code: 'conn_error',
						message: error.message
					},
					error: true
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
		log.info('lws req %2j', msg);
		switch (msg.type) {
			case 'init':
				return this.startSecureServer(msg, conn);
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
		this.wss = new WebSocket.Server({
			port: WS_PORT,
			verifyClient: this.verifyClient.bind(this)
		});
		this.wss.on('connection', this.handleConn.bind(this));
		this.wss.on('error', err => {
			log.error(err);
			if (err.code === 'EADDRINUSE') {
				WS_PORT++;
				log.info('Address in use, retrying on port ' + WS_PORT);
				setTimeout(() => {
					httpsServer.listen(WS_PORT);
				}, 250);
			}
		});
	}

	startSecureServer(msg, conn) {
		log.info('starting wss');
		conn.send(
			{
				payload: { message: 'starting secure ws server' }
			},
			msg
		);

		// TODO: trigger modal here and wait for user accept then
		// TODO: updgrade all incoming connections to secure websocket

		init().then(config =>
			certs(config).then(status => {
				if (status === 'wss') {
					const httpsServer = new https.createServer({
						cert: fs.readFileSync(config.reqFile),
						key: fs.readFileSync(config.rsaFile)
					});

					this.wss = new WebSocket.Server({
						server: httpsServer,
						port: WS_PORT,
						verifyClient: this.verifyClient.bind(this)
					});
					this.wss.on('connection', this.handleConn.bind(this));
					this.wss.on('error', err => log.error(err));

					httpsServer
						.listen(WS_PORT, () => {
							log.info('HTTPS listening:' + WS_PORT);
						})
						.on('error', err => {
							if (err.code === 'EADDRINUSE') {
								WS_PORT++;
								log.info('Address in use, retrying on port ' + WS_PORT);
								setTimeout(() => {
									httpsServer.listen(WS_PORT);
								}, 250);
							}
						});
					log.info('secure ws server started');
				} else {
					log.info('error starting wss');
				}
			})
		);
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
		log.info('lws resp %2j', msg);
		this.conn.send(JSON.stringify(msg));
	}
}
