import _ from 'lodash';
import WebSocket from 'ws';
import Wallet from '../wallet/wallet';
import { checkPassword } from '../keystorage';
import { Logger } from 'common/logger';
import { IdAttribute } from '../identity/id-attribute';
import fetch from 'node-fetch';
import { URLSearchParams } from 'url';
import ethUtil from 'ethereumjs-util';

const WS_PORT = process.env.LWS_WS_PORT || 8898;

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
			lable: requiredMapByKey[attr.type].label,
			attrigute: attr.data.value ? attr.data.value : attr.data
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

	startServer() {
		this.wss = new WebSocket.Server({ port: WS_PORT });
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
