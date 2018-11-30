import _ from 'lodash';
import WebSocket from 'ws';
import Wallet from '../wallet/wallet';
import { checkPassword } from '../keystorage';
import { Logger } from 'common/logger';
import fetch from 'node-fetch';
import util from 'util';
import fs from 'fs';
import path from 'path';
import https from 'https';
import ChildProcess from 'child_process';
import sudo from 'sudo-prompt';
import common from 'common/utils/common';
import request from 'request';
import selfkey from 'selfkey.js';
import tcpPortUsed from 'tcp-port-used';
import { ipcMain } from 'electron';
import pkg from '../../../package.json';

const log = new Logger('LWSService');

export const WS_ORIGINS_WHITELIST = process.env.WS_ORIGINS_WHITELIST
	? process.env.WS_ORIGINS_WHITELIST.split(',')
	: [
			'chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik',
			'chrome-extension://fmmadhehohahcpnjjkbdajimilceilcd'
	  ];

export const WS_IP_WHITELIST = process.env.WS_IP_WHITELIST
	? process.env.WS_IP_WHITELIST.split(',')
	: ['127.0.0.1', '::1'];

export const WS_PORT = process.env.LWS_WS_PORT || 8898;
export const WSS_PORT = process.env.LWS_WSS_PORT || 8899;

export const userAgent = `SelfKeyIDW/${pkg.version}`;

const currentOS = process.platform;
const userDataPath = common.getUserDataPath();

function init() {
	let macos = {
		lwsPath: path.join(userDataPath, '/lws/'),
		lwsKeyPath: path.join(userDataPath, '/lws/keys/'),
		reqFile: path.join(userDataPath, '/lws/keys/lws_cert.pem'),
		rsaFile: path.join(userDataPath, '/lws/keys/lws_key.pem'),
		keyTempFile: path.join(userDataPath, '/lws/keys/keytemp.pem'),
		certgen: null
	};

	macos.certgen = [
		{
			cmd: `openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -subj "/C=NV/ST=SK/L=Nevis/O=selfkey/CN=localhost" -extensions EXT -config <( printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth") -keyout "${
				macos.keyTempFile
			}" -out "${macos.reqFile}"`,
			options: {
				shell: '/bin/bash'
			},
			type: 'child'
		},
		{
			cmd: `openssl rsa -in "${macos.keyTempFile}" -out "${macos.rsaFile}"`,
			options: {
				shell: '/bin/bash'
			},
			type: 'child'
		},
		{
			cmd: `security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "${
				macos.reqFile
			}"`,
			options: {
				name: 'SelfKey needs to install a security certifcate to encrypt data and'
			},
			type: 'sudo'
		}
	];

	let linux = {
		lwsPath: path.join(userDataPath, '/lws/'),
		lwsKeyPath: path.join(userDataPath, '/lws/keys/'),
		reqFile: path.join(userDataPath, '/lws/keys/lws_cert.pem'),
		rsaFile: path.join(userDataPath, '/lws/keys/lws_key.pem'),
		keyTempFile: path.join(userDataPath, '/lws/keys/keytemp.pem'),
		certgen: null
	};

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
	];

	let windows = {
		certgen: [
			{
				cmd:
					'New-SelfSignedCertificate -Type Custom -Subject "C=NV,ST=SK,L=Nevis,O=selfkey,CN=localhost" -TextExtension @("2.5.29.37={text}1.3.6.1.5.5.7.3.1") -DnsName "localhost" -KeyUsage DigitalSignature -KeyAlgorithm RSA -KeyLength 2048 -CertStoreLocation "Cert:CurrentUser\\My"',
				options: {},
				type: 'power'
			}
		]
	};

	switch (currentOS) {
		case 'darwin':
			return macos;
		case 'linux':
			return linux;
		case 'win32':
			return windows;
	}
}

async function checkPort(port) {
	try {
		let check = await tcpPortUsed.check(port, '127.0.0.1');
		return check;
	} catch (error) {
		log.error('Error on port check %s', error);
		throw error;
	}
}

async function executor(cmd, options) {
	const exec = util.promisify(ChildProcess.exec);
	try {
		await exec(cmd, options);
		log.info(`command executed successfully`);
	} catch (error) {
		log.error(error);
		throw error;
	}
}

async function sudocutor(cmd, options) {
	log.info(`running sudo ${cmd} %2j', options`);
	const exec = util.promisify(sudo.exec);
	try {
		await exec(cmd, options);
		log.info(`sudo command executed successfully`);
	} catch (error) {
		log.error(error);
		throw error;
	}
}

async function windocutor(cmd, options) {
	if (!['win32', 'win64'].includes(currentOS)) {
		throw new Error('Only for windows');
	}
	const PowerShell = require('node-powershell');
	let ps = new PowerShell({
		executionPolicy: 'Bypass',
		noProfile: true
	});
	ps.addCommand(cmd);
	try {
		return await ps.invoke();
	} catch (error) {
		ps.dispose();
		log.error(error);
		throw error;
	}
}

function ensureDirs(config) {
	if (!fs.existsSync(config.lwsPath)) {
		fs.mkdirSync(config.lwsPath);
	}
	if (!fs.existsSync(config.lwsKeyPath)) {
		fs.mkdirSync(config.lwsKeyPath);
	}
}

function checkKeys(config) {
	return fs.existsSync(config.reqFile) && fs.existsSync(config.rsaFile);
}

function userPrompt(app, msgType) {
	return new Promise((resolve, reject) => {
		ipcMain.once('WSS_INSTALL', (event, install) => resolve(!!install));
		app.win.webContents.send('WSS_USER_PROMPT', msgType);
	});
}

async function runCertgen(config) {
	try {
		let exec = null;
		for (let run of config.certgen) {
			let { type, cmd, options } = run;
			exec = executor;
			if (type === 'sudo') exec = sudocutor;
			if (type === 'power') exec = windocutor;
			await exec(cmd, options);
		}
	} catch (error) {
		log.error(error);
		throw error;
	}
}

async function certs(config, app) {
	ensureDirs(config);
	if (checkKeys(config)) return true;
	if (!(await userPrompt(app, 'install'))) return false;
	let certgen = !!(await runCertgen(config));
	await userPrompt(app, 'success'); // dirty hack for now
	return certgen;
}

export class LWSService {
	constructor({ rpcHandler, app }) {
		this.wss = null;
		this.secureWss = null;
		this.httpServer = null;
		this.rpcHandler = rpcHandler;
		this.app = app;
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
			const signature = await selfkey.createSignature(nonceResp.nonce, check.privateKey);
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
				form.attributes = msg.payload.attributes;
			}
			const options = {
				url: msg.payload.website.apiUrl,
				method: 'POST',
				headers: {
					'User-Agent': userAgent
				},
				json: form
			};
			conn.send(
				await new Promise((resolve, reject) => {
					request.post(options, (err, resp, body) => {
						let lwsResp = {};
						try {
							lwsResp = {
								payload: JSON.parse(body)
							};
						} catch (e) {
							lwsResp = {
								payload: e
							};
						}
						if (err || resp.statusCode >= 400) {
							lwsResp.error = true;
							lwsResp.payload = {
								code: resp.statusCode,
								message: body
							};
						}
						resolve(lwsResp);
					});
				}),
				msg
			);
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
		log.debug('lws secure req %2j', msg);
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
		log.debug('lws req %2j', msg);
		switch (msg.type) {
			case 'wss_init':
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
		if (await checkPort(WSS_PORT)) {
			log.info('wss already started');
			return conn.send(
				{
					payload: { message: 'wss already started' }
				},
				msg
			);
		}

		log.info('starting wss');
		conn.send(
			{
				payload: { message: 'starting secure wss server' }
			},
			msg
		);
		const config = await init(); // gets config for cert gen

		if (!(await certs(config, this.app))) {
			log.info('error starting wss');
			return conn.send(
				{
					error: true,
					payload: { message: 'error starting wss' }
				},
				msg
			);
		}
		this.httpsServer = https.createServer({
			cert: fs.readFileSync(config.reqFile),
			key: fs.readFileSync(config.rsaFile)
		});
		this.secureWss = new WebSocket.Server({
			server: this.httpsServer
		})
			.on('connection', this.handleSecureConn.bind(this))
			.on('error', err => log.error(err));
		this.httpsServer.listen(WSS_PORT, () => log.info('wss listening on port ' + WSS_PORT));
		log.info('secure wss server started');
		conn.send(
			{
				payload: { message: 'secure wss server started' }
			},
			msg
		);
	}
}
export class WSConnection {
	constructor(conn, service, secure) {
		this.conn = conn;
		this.service = service;
		this.msgId = 0;
		this.secure = secure;
		this.ctx = {
			unlockedWallets: {}
		};
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
			let { service } = this;
			let handler = this.secure ? service.handleSecureRequest : service.handleRequest;
			handler.call(service, msg, this);
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
