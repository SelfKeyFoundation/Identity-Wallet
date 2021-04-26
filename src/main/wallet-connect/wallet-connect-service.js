import WalletConnect from '@walletconnect/client';
import { Logger } from 'common/logger';
import { walletConnectOperations } from '../../common/wallet-connect';
import { Identity } from '../platform/identity';
import { getWallet } from '../../common/wallet/selectors';
import { identitySelectors } from 'common/identity';
import EthUtils from '../../common/utils/eth-utils';
import WalletConnectSessions from './wallet-connect-sessions';
import ScanQrCodeService from './scan-qr-code-service';
const log = new Logger('WalletConnectService');

export class WalletConnectService {
	HANDLER_NAME = 'wallet-connect';

	constructor({ config, store, mainWindow, web3Service, ethGasStationService }) {
		this.config = config;
		this.store = store;
		this.mainWindow = mainWindow;
		this.web3Service = web3Service;
		this.ethGasStationService = ethGasStationService;
		this.connectors = [];
		this.init();
	}

	focusWindow() {
		if (this.mainWindow) {
			if (this.mainWindow.isMinimized()) this.mainWindow.restore();

			let attempts = 0;
			let timeout = null;
			const refocus = () => {
				if ((this.mainWindow.isFocused() || attempts > 5) && timeout) {
					clearTimeout(timeout);
					timeout = null;
					return;
				}
				this.mainWindow.setFocusable(true);
				this.mainWindow.moveTop();
				this.mainWindow.focus();
				this.mainWindow.flashFrame(true);
				attempts++;
				timeout = setTimeout(refocus, 1000);
			};
			refocus();
		}
	}

	async init() {
		log.info('init wallet connect service');
		const sessions = await this.getSessions();
		console.log(sessions);
		sessions.forEach(c => this.handleSession(null, c.session, c.id));
	}

	async handleSession(uri, session, dbId) {
		if (session && !session.connected) {
			log.info('Session not connected, deleting it');
			await WalletConnectSessions.delete(dbId);
			return;
		}

		let connector = null;
		try {
			connector = new WalletConnect({
				uri,
				session,
				clientMeta: {
					description: 'Selfkey Identity Wallet',
					url: 'https://selfkey.org',
					icons: ['https://selfkey.org/wp-content/uploads/2019/02/Logo.png'],
					name: 'Selfkey'
				}
			});
		} catch (e) {
			log.error(e);
		}

		if (!connector) {
			log.info('Connector not found, not initializing events');
			return;
		}

		const key = session ? session.key : uri;
		connector.uri = uri;

		this.connectors[key] = connector;
		this.connectors[key].dbId = dbId;
		if (session) {
			console.log(session);
			this.connectors[key].peerMeta = session.peerMeta;
			this.connectors[key].peerId = session.peerId;
		}

		this.connectors[key].on('session_request', (error, payload) => {
			if (error) {
				log.error(error);
				throw error;
			}

			log.info('session request %2j', payload);

			const { peerMeta, peerId } = payload.params[0];

			this.connectors[key].peerMeta = peerMeta;
			this.connectors[key].peerId = peerId;

			this.focusWindow();
			const confirmConnection = payload.params[0];

			this.store.dispatch(
				walletConnectOperations.sessionRequestOperation(
					peerId,
					peerMeta,
					uri,
					confirmConnection
				)
			);
		});

		this.connectors[key].on('session_update', error => {
			console.log('EVENT', 'session_update');

			if (error) {
				throw error;
			}
		});

		this.connectors[key].on('call_request', (error, payload) => {
			// tslint:disable-next-line
			console.log('EVENT', 'call_request', payload);
			console.log('EVENT', 'call_request', 'method', payload.method);
			console.log('EVENT', 'call_request', 'params', payload.params);

			if (error) {
				throw error;
			}

			payload.peerMeta = this.connectors[key].peerMeta;
			payload.peerId = this.connectors[key].peerId;

			switch (payload.method) {
				case 'personal_sign':
					return this.handlePersonalSignRequest(payload);
				case 'eth_sendTransaction':
				case 'eth_signTransaction':
					return this.handleTransaction(payload);
			}
			log.info('unsuported call method %s', payload.method);
		});

		this.connectors[key].on('disconnect', async (error, payload) => {
			console.log('EVENT', 'disconnect', payload);

			if (error) {
				throw error;
			}

			await WalletConnectSessions.delete(this.connectors[key].dbId);

			this.store.dispatch(walletConnectOperations.loadSessionsOperation());
			log.info('disconnect');
		});

		if (this.connectors[key].session) {
			try {
				await this.connectors[key].createSession();
			} catch (err) {
				console.error('create session:' + err);
			}
		}
	}

	rejectSession(uri) {
		log.info(`Reject session %s`, uri);
		if (this.connectors[uri]) {
			this.connectors[uri].rejectSession();
		}
	}

	async approveSession(address, uri, confirmConnection, peerMeta) {
		log.info(`Approve session %s`, uri);

		if (this.connectors[uri]) {
			this.connectors[uri].approveSession({
				accounts: [address],
				chainId: confirmConnection.chainId
			});

			const { name, url, icons = [] } = peerMeta;
			const [icon] = icons;

			const dbSession = await WalletConnectSessions.create({
				address,
				session: this.connectors[uri].session,
				name,
				url,
				icon
			});
			this.connectors[uri].dbId = dbSession.id;
			log.info(`Savad wallet connect session with id %s`, this.connectors[uri].key);

			this.store.dispatch(walletConnectOperations.loadSessionsOperation());
			this.store.dispatch(walletConnectOperations.sessionRequestOperation());
			return true;
		} else {
			throw new Error(`Connector for ${uri} not active`);
		}
	}

	async handleUrlCommand(cmd) {
		this.connectors[cmd] = new WalletConnect({
			// Required
			uri: cmd,
			// Required
			clientMeta: {
				description: 'Selfkey Identity Wallet',
				url: 'https://selfkey.org',
				icons: ['https://selfkey.org/wp-content/uploads/2019/02/Logo.png'],
				name: 'Selfkey'
			}
		});

		this.connectors[cmd].on('session_request', (error, payload) => {
			if (error) {
				log.error(error);
				throw error;
			}

			log.info('session request %2j', payload);

			const { peerMeta, peerId } = payload.params[0];

			this.peerMeta = peerMeta;
			this.peerId = peerId;
			this.focusWindow();
			this.store.dispatch(walletConnectOperations.sessionRequestOperation(peerId, peerMeta));
		});

		this.connectors[cmd].on('session_update', error => {
			console.log('EVENT', 'session_update');

			if (error) {
				throw error;
			}
		});

		this.connectors[cmd].on('call_request', async (error, payload) => {
			// tslint:disable-next-line
			console.log('EVENT', 'call_request', 'method', payload.method);
			console.log('EVENT', 'call_request', 'params', payload.params);

			if (error) {
				throw error;
			}

			switch (payload.method) {
				case 'personal_sign':
					return this.handlePersonalSignRequest(payload);
				case 'eth_sendTransaction':
				case 'eth_signTransaction':
					return this.handleTransaction(payload);
			}
			log.info('unsuported call method %s', payload.method);
		});

		this.connectors[cmd].on('connect', (error, payload) => {
			console.log('EVENT', 'connect', payload);

			if (error) {
				throw error;
			}

			log.info('connected');
		});

		this.connectors[cmd].on('disconnect', (error, payload) => {
			console.log('EVENT', 'disconnect', payload);

			if (error) {
				throw error;
			}

			log.info('disconnect');
		});
	}

	handlePersonalSignRequest({ id, method, params }) {
		const [message] = params;
		this.focusWindow();
		this.store.dispatch(
			walletConnectOperations.signMessageOperation(id, this.peerMeta, this.peerId, message)
		);
	}

	async handleTransaction({ id, method, params, peerMeta, peerId }) {
		const rawTx = params[0];
		rawTx.nonce = await this.web3Service.getNextNonce(rawTx.from);
		const tx = { ...rawTx };
		tx.gas = EthUtils.hexToDecimal(tx.gas);
		// TODO: Workaround for gasPrice, ideally we should not override gasPrice
		const gasStationInfo = await this.ethGasStationService.getInfo();
		tx.gasPrice = gasStationInfo.average;
		if (tx.value) tx.value = EthUtils.hexToDecimal(tx.value);
		this.focusWindow();
		this.store.dispatch(
			walletConnectOperations.transactionOperation(id, peerMeta, peerId, tx, method, rawTx)
		);
	}

	async signPersonalMessage(id, message) {
		const state = this.store.getState();
		const identity = new Identity(getWallet(state), identitySelectors.selectIdentity(state));
		try {
			const signature = await identity.genSignatureForMessage(message);
			this.approveRequest(id, signature);
		} catch (error) {
			log.error(error);
			this.rejectRequest(id);
		}
	}

	rejectRequest(id, error = {}) {
		if (this.connector) {
			this.connector.rejectRequest({
				id,
				error
			});
		}
	}

	approveRequest(id, result) {
		log.info('%s, %2j', id, result);
		if (this.connector) {
			this.connector.approveRequest({
				id,
				result
			});
		}
	}

	async killSession(id) {
		Object.keys(this.connectors).forEach(key => {
			if (this.connectors[key].dbId === id) {
				this.connectors[key].killSession();
			}
		});
	}

	killSessions() {
		/*
		Object.keys(this.connectors).forEach(key => {
			this.connectors[key].killSession();
		});
		*/
		if (this.connector) {
			this.connector.killSession();
		}
	}

	getSessions() {
		return WalletConnectSessions.findAll();
	}

	scanQrCode() {
		this.scanService = new ScanQrCodeService({
			config: this.config,
			mainWindow: this.mainWindow,
			store: this.store
		});
	}
}

export default WalletConnectService;
