import _ from 'lodash';
import WebSocket from 'ws';
import Wallet from '../wallet/wallet';
import { checkPassword } from '../keystorage';
import { Logger } from 'common/logger';
import { IdAttribute } from '../identity/id-attribute';

const WS_PORT = process.env.LWS_WS_PORT || 8898;

const log = new Logger('LWSService');

export class LWSService {
	constructor({ store }) {
		this.wss = null;
		this.store = store;
	}

	checkWallet(pubKey) {
		const res = { pubKey, status: false };
		const { wallet } = this.store.getState();
		if (!wallet || !wallet.privateKey || !wallet.publicKey === pubKey) return res;
		return { ...res, status: true, privateKey: wallet.privateKey };
	}

	async reqWallets(msg, conn) {
		let data = await Wallet.findAll();
		data = data.map(w => {
			let checked = this.checkWallet(w.publicKey);
			return {
				id: w.id,
				pubKey: w.publicKey,
				unlocked: checked.status
			};
		});
		conn.send({
			response: 'wallets',
			data
		});
	}

	async reqWallet(msg, conn) {
		const checked = this.checkWallet(msg.data.pubKey);
		const data = _.pick(checked, 'pubKey', 'status');
		conn.send({
			response: 'wallet',
			data
		});
	}

	async reqUnlock(msg, conn) {
		let wallet = await Wallet.findByPublicKey(msg.data.pubKey);
		let data = {
			publicKey: wallet.publicKey,
			check: checkPassword(wallet, msg.data.password)
		};
		conn.send({
			response: 'unlock',
			data
		});
	}

	async reqAttributes(msg, conn) {
		let walletAttrs = await IdAttribute.findAllByWalletId(msg.data.wid);
		let data = walletAttrs;

		conn.send({
			response: 'attributes',
			data
		});
	}

	async reqAuth(msg, conn) {}

	reqUnknown(msg, conn) {
		log.error('unknown request %s', msg.request);
		conn.send({
			response: msg.request,
			error: 'unknown request'
		});
	}

	async handleRequest(msg, conn) {
		switch (msg.request) {
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
		let wsConn = new WSConnection(conn, this);
		wsConn.listen();
	}

	startServer() {
		this.wss = new WebSocket.Server({ port: WS_PORT });
		this.wss.on('connection', this.handleWSConn.bind(this));
	}
}

export class WSConnection {
	constructor(conn, service) {
		this.conn = conn;
		this.service = service;
	}

	handleMessage(msg) {
		msg = JSON.parse(msg);
		this.service.handleRequest(msg, this).catch(err => {
			log.error(err);
		});
	}

	listen() {
		this.conn.on('message', this.handleWSMessage());
	}

	send(msg) {
		if (!this.conn) {
			log.error('cannot send message, no connection');
			return;
		}
		this.conn.send(JSON.stringify(msg));
	}
}
