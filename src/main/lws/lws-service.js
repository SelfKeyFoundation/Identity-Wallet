import WebSocket from 'ws';
import Wallet from '../wallet/wallet';
import { Logger } from 'common/logger';
import pkg from '../../../package.json';

import Identity from '../platform/identity';
import RelyingPartySession from '../platform/relying-party';

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

export const userAgent = `SelfKeyIDW/${pkg.version}`;

export class LWSService {
	constructor({ rpcHandler, app }) {
		this.wss = null;
		this.httpServer = null;
		this.rpcHandler = rpcHandler;
		this.app = app;
	}

	async reqWallets(msg, conn) {
		const { website } = msg.payload;
		let payload = await Wallet.findAll();
		payload = await Promise.all(
			payload.map(async w => {
				let unlocked = !!conn.getIdentity(w.publicKey);
				let signedUp = unlocked && (await w.hasSignedUpTo(website.url));
				return {
					publicKey: w.publicKey,
					unlocked,
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
		let payload = { publicKey: msg.payload.publicKey, unlocked: false };
		let wallet = await Wallet.findByPublicKey(msg.payload.publicKey);
		let identity = new Identity(wallet);
		payload.profile = identity.profile;
		try {
			await identity.unlock({ password: msg.payload.password });
			conn.addIdentity(identity);
			payload.unlocked = true;
			payload.signedUp = await wallet.hasSignedUpTo(msg.payload.website.url);
		} catch (error) {
			payload.unlocked = false;
		}

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
				// TODO: Fix, attribute can contain multiple files now
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

	async reqAuth(msg, conn) {
		const { publicKey, config, attributes } = msg.payload;
		let identity = conn.getIdentity(publicKey);

		if (!(await identity.isUnlocked())) {
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
		let session = new RelyingPartySession(config, identity);
		try {
			await session.establish();
		} catch (error) {
			return this.authResp(
				{
					payload: {
						code: 'session_establish',
						message: error.message
					},
					error: true
				},
				msg,
				conn
			);
		}
		if (attributes) {
			try {
				await session.createUser(attributes);
			} catch (error) {
				return this.authResp(
					{
						payload: {
							code: 'user_create_error',
							message: error.message
						},
						error: true
					},
					msg,
					conn
				);
			}
		}
		try {
			let payload = await session.getUserLoginPayload();
			return this.authResp({ payload }, msg, conn);
		} catch (error) {
			let payload = {
				code: error.statusCode || 'token_error',
				message: error.message
			};
			return this.authResp({ payload, error: true }, msg, conn);
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

	async handleRequest(msg, conn) {
		log.debug('lws req %2j', msg);

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
		this.wss.on('error', err => log.error(err));
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
		return this.ctx.unlockedWallets[publicKey] || null;
	}

	async handleMessage(msg) {
		try {
			msg = JSON.parse(msg);
			let { service } = this;
			service.handleRequest(msg, this);
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
		msg.meta.id = id || `idw-${this.msgId++}`;
		msg.meta.src = msg.meta.src || 'idw';
		if (!msg.type && msg.error) {
			msg.type = 'error';
		}
		log.info('lws resp %2j', msg);
		this.conn.send(JSON.stringify(msg));
	}
}
