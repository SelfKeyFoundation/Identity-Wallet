import WebSocket from 'ws';
import Wallet from '../wallet/wallet';
import { Logger } from 'common/logger';
import { getGlobalContext } from 'common/context';
import pkg from '../../../package.json';

import Identity from '../platform/identity';
import RelyingPartySession from '../platform/relying-party';
import identityUtils from '../../common/identity/utils';
import timeoutPromise from 'common/utils/timeout-promise';
import EventEmitter from 'events';

const log = new Logger('LWSService');

const eventEmitter = new EventEmitter();

export const WS_ORIGINS_WHITELIST = process.env.WS_ORIGINS_WHITELIST
	? process.env.WS_ORIGINS_WHITELIST.split(',')
	: [
			'chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik',
			'chrome-extension://fmmadhehohahcpnjjkbdajimilceilcd'
	  ];

export const WS_IP_WHITELIST = process.env.WS_IP_WHITELIST
	? process.env.WS_IP_WHITELIST.split(',')
	: ['127.0.0.1', '::1', '::ffff:127.0.0.1'];

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
		const { website, did } = msg.payload.config;
		let payload = await Wallet.findAll().eager('identities');
		payload = await Promise.all(
			payload.map(async w => {
				const identity = conn.getIdentity(w.publicKey);
				let unlocked = !!identity;
				let signedUp = unlocked && (await w.hasSignedUpTo(website.url));
				const retWallet = {
					publicKey: w.publicKey,
					unlocked,
					profile: w.profile,
					name: w.name,
					signedUp
				};
				if (unlocked) {
					retWallet.hasSelfkeyId = identity.ident.isSetupFinished;
					if (did && identity.did) {
						retWallet.did = identity.did;
					}
				}

				return retWallet;
			})
		);
		conn.send(
			{
				payload
			},
			msg
		);
	}

	getHardwareWalletsPayload(wallets, conn, website, type) {
		return Promise.all(
			wallets.map(async w => {
				let unlocked = !!conn.getIdentity(w.publicKey);
				const wallet = Wallet.findByPublicKey(w.publicKey);
				let signedUp = unlocked && wallet && (await wallet.hasSignedUpTo(website.url));
				return {
					publicKey: w.publicKey,
					unlocked,
					profile: type,
					signedUp
				};
			})
		);
	}

	async reqLedgerWallets(msg, conn) {
		const walletService = getGlobalContext().walletService;
		const { website, page } = msg.payload.config;
		const accountsQuantity = 6;
		try {
			let wallets = await timeoutPromise(
				30000,
				walletService.getLedgerWallets(page, accountsQuantity)
			).promise;
			const payload = await this.getHardwareWalletsPayload(wallets, conn, website, 'ledger');
			conn.send(
				{
					payload
				},
				msg
			);
		} catch (error) {
			log.error(error);
			conn.send(
				{
					error: true,
					payload: {
						code: 'ledger_error',
						message: error.message
					}
				},
				msg
			);
		}
	}

	async reqTrezorWallets(msg, conn) {
		const walletService = getGlobalContext().walletService;
		const { website, page } = msg.payload.config;
		const accountsQuantity = 6;
		try {
			if (eventEmitter.listenerCount('TREZOR_PIN_REQUEST') === 0) {
				eventEmitter.on('TREZOR_PIN_REQUEST', async () => {
					conn.send({ type: 'wait_trezor_pin' });
				});
			}
			if (eventEmitter.listenerCount('TREZOR_PASSPHRASE_REQUEST') === 0) {
				eventEmitter.on('TREZOR_PASSPHRASE_REQUEST', async () => {
					conn.send({ type: 'wait_trezor_passphrase' });
				});
			}

			let wallets = await timeoutPromise(
				60000,
				walletService.getTrezorWallets(page, accountsQuantity, eventEmitter)
			).promise;
			const payload = await this.getHardwareWalletsPayload(wallets, conn, website, 'trezor');
			conn.send(
				{
					payload
				},
				msg
			);
		} catch (error) {
			log.error(error);
			conn.send(
				{
					error: true,
					payload: {
						code: 'trezor_error',
						message: error.message
					}
				},
				msg
			);
		}
	}

	enterTrezorPin(msg, conn) {
		const { error, pin } = msg.payload;
		if (error !== null) {
			eventEmitter.off('TREZOR_PIN_REQUEST', () => {});
		}
		eventEmitter.emit('ON_PIN', error, pin);
	}

	enterTrezorPassphrase(msg, conn) {
		const { error, passphrase } = msg.payload;
		if (error !== null) {
			eventEmitter.off('TREZOR_PASSPHRASE_REQUEST', () => {});
		}
		eventEmitter.emit('ON_PASSPHRASE', error, passphrase);
	}

	async reqUnlock(msg, conn) {
		const { publicKey, password, config, profile, path } = msg.payload;
		let payload = { publicKey, unlocked: false };
		let wallet = await Wallet.findByPublicKey(publicKey).eager('identities');
		const ident = wallet.getDefaultIdentity();
		log.debug('XXX reqUnlock ident %2j', ident);
		wallet = !wallet
			? await Wallet.create({
					publicKey,
					profile,
					path
			  })
			: wallet;
		let identity = new Identity(wallet, ident);
		payload.profile = identity.profile;
		try {
			await identity.unlock({ password });
			conn.addIdentity(publicKey, identity);
			payload.unlocked = true;
			payload.hasSelfkeyId = ident.isSetupFinished;
			if (config.did) {
				payload.did = identity.did || null;
			}
			payload.name = wallet.name;
			payload.signedUp = await wallet.hasSignedUpTo(config.website.url);
		} catch (error) {
			log.error(error);
			payload.unlocked = false;
		}

		conn.send(
			{
				payload
			},
			msg
		);
	}

	async reqAttributes(msg, conn) {
		const { publicKey, requestedAttributes } = msg.payload;
		let identity = conn.getIdentity(publicKey);
		if (!identity) {
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
		try {
			let fetchedAttrs = await identity.getAttributesByTypes(
				requestedAttributes.map(attr => attr.schemaId || attr.attribute || attr)
			);
			fetchedAttrs = fetchedAttrs.reduce((acc, curr) => {
				acc[curr.attributeType.url] = acc[curr.attributeType.url] || [];
				acc[curr.attributeType.url].push(curr);
				return acc;
			}, {});

			let payload = requestedAttributes.map(attr => {
				const schemaId = attr.schemaId || attr.attribute || attr;
				const fetched = fetchedAttrs[schemaId];
				const attributeType = fetched ? fetched[0].attributeType : null;
				const schema = attributeType ? attributeType.content : null;

				const options = fetched
					? fetched.map(f => {
							let value = f.data.value;
							let documents = f.documents.map(doc => {
								doc.buffer = doc.buffer.toString('base64');
								return doc;
							});
							return {
								id: f.id,
								name: f.name,
								value: identityUtils.identityAttributes.denormalizeDocumentsSchema(
									schema,
									value,
									documents
								).value
							};
					  })
					: null;

				return {
					uiId: attr.uiId,
					id: attr.id,
					title: attr.title || attr.label || (schema && schema.title),
					options,
					schemaId,
					schema,
					selected: 0,
					required: attr.required
				};
			});

			return conn.send({ payload: { publicKey, attributes: payload } }, msg);
		} catch (error) {
			log.error(error);
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
		const { publicKey, config, profile } = msg.payload;
		let identity = conn.getIdentity(publicKey);
		if (!identity) {
			return this.authResp(
				{
					error: true,
					payload: {
						code: 'not_authorized',
						message: 'Wallet is locked, cannot auth with relying party'
					}
				},
				msg,
				conn
			);
		}
		let session = new RelyingPartySession(config, identity);
		try {
			if (profile === 'ledger') {
				conn.send({ type: 'wait_hw_confirmation' });
			}
			await session.establish();
		} catch (error) {
			log.error(error);
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
		try {
			let payload = await session.getUserLoginPayload();
			return this.authResp({ payload }, msg, conn);
		} catch (error) {
			log.error(error);
			let payload = {
				code: 'token_error',
				message: 'User authentication failed'
			};
			return this.authResp({ payload, error: true }, msg, conn);
		}
	}

	async reqSignup(msg, conn) {
		const { publicKey, config, attributes, profile } = msg.payload;
		let identity = conn.getIdentity(publicKey);
		if (!identity) {
			return this.authResp(
				{
					error: true,
					payload: {
						code: 'not_authorized',
						message: 'Wallet is locked, cannot signup with relying party'
					}
				},
				msg,
				conn
			);
		}
		let session = new RelyingPartySession(config, identity);
		try {
			if (profile === 'ledger') {
				conn.send({ type: 'wait_hw_confirmation' });
			}
			await session.establish();
		} catch (error) {
			log.error(error);
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

		try {
			let rpAttributes = (attributes || [])
				.filter(attr => {
					if (!attr.options || attr.options.length === 0) {
						return false;
					}
					return !!attr.options[attr.selected];
				})
				.map(attr => {
					let normalized = identityUtils.identityAttributes.normalizeDocumentsSchema(
						attr.schema,
						attr.options[attr.selected].value
					);
					return {
						id: attr.id,
						schemaId: attr.schemaId,
						schema: attr.schema,
						data: normalized.value,
						documents: normalized.documents.map(doc => {
							doc.buffer = Buffer.from(doc.buffer, 'base64');
							return doc;
						})
					};
				});
			await session.createUser(rpAttributes, config.meta || {});
			return this.authResp(
				{
					payload: 'ok'
				},
				msg,
				conn
			);
		} catch (error) {
			log.error(error);
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

	async authResp(resp, msg, conn) {
		try {
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
		} catch (error) {
			log.error(error);
		}
		return conn.send(resp, msg);
	}

	formatLoginAttempt(msg, resp) {
		let { config, attributes = [] } = msg.payload || {};
		let website = config.website;
		let attempt = {
			websiteName: website.name,
			websiteUrl: website.url,
			signup: attributes.length > 0,
			success: true,
			errorCode: null,
			errorMessage: null
		};
		if (resp.error) {
			attempt.success = false;
			attempt.errorCode = resp.payload.code || 'unknown_error';
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
			case 'signup':
				return this.reqSignup(msg, conn);
			case 'version':
				return this.reqVersion(msg, conn);
			case 'ledgerwallets':
				return this.reqLedgerWallets(msg, conn);
			case 'trezorwallets':
				return this.reqTrezorWallets(msg, conn);
			case 'trezorpin':
				return this.enterTrezorPin(msg, conn);
			case 'trezorpassphrase':
				return this.enterTrezorPassphrase(msg, conn);
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
			identities: {}
		};
	}

	addIdentity(publicKey, identity) {
		this.ctx.identities[publicKey] = identity;
	}

	getIdentity(publicKey) {
		return this.ctx.identities[publicKey] || null;
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
		log.debug('lws resp %2j', msg);
		this.conn.send(JSON.stringify(msg));
	}
}
