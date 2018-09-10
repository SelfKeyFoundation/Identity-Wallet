import _ from 'lodash';
import WebSocket from 'ws';
import Wallet from '../wallet/wallet';
import { checkPassword } from '../keystorage';
import { Logger } from 'common/logger';
import fetch from 'node-fetch';
import ethUtil from 'ethereumjs-util';
import pkg from '../../../package.json';

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

const log = new Logger('LWSService');

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
		payload.profile = wallet.profile;
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

	async genSignature(nonce, publicKey, conn) {
		const check = this.checkWallet(publicKey, conn);
		if (!check.unlocked) {
			return null;
		}
		const msgHash = ethUtil.hashPersonalMessage(Buffer.from(nonce, 'hex'));
		const signature = ethUtil.ecsign(msgHash, Buffer.from(check.privateKey, 'hex'));
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
			const body = {
				publicKey: msg.payload.publicKey,
				nonce: nonceResp.nonce,
				signature: this.genSignature(nonceResp.nonce, msg.payload.publicKey, conn)
			};

			if (msg.attributes) {
				body.attributes = msg.attributes;
			}

			let resp = await fetch(msg.payload.website.apiUrl, {
				method: 'POST',
				body,
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					'User-Agent': userAgent
				}
			});

			let respData = (await resp.json()) || {};
			let lwsResp = {
				payload: respData
			};
			if (resp.status !== 200 || respData.error) {
				lwsResp.error = true;
				lwsResp.payload = {
					code: lwsResp.code || 'api_error',
					message: lwsResp.error || 'Unknown api error'
				};
			}
			if (resp.status === 200) {
				// TODO: mark wallet signed up to website
			}
			conn.send(lwsResp, msg);
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
			await this.service.handleRequest(msg, this);
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
