import WalletConnect from '@walletconnect/client';
import { Logger } from 'common/logger';
import { walletConnectOperations } from '../../common/wallet-connect';
import { Identity } from '../platform/identity';
import { getWallet } from '../../common/wallet/selectors';
import { identitySelectors } from 'common/identity';
import EthUtils from '../../common/utils/eth-utils';
const log = new Logger('WalletConnectService');

export class WalletConnectService {
	HANDLER_NAME = 'wallet-connect';

	constructor({ config, store, mainWindow, web3Service }) {
		this.config = config;
		this.store = store;
		this.mainWindow = mainWindow;
		this.web3Service = web3Service;
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

	async handleUrlCommand(cmd) {
		this.connector = new WalletConnect({
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

		this.connector.on('session_request', (error, payload) => {
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

		this.connector.on('session_update', error => {
			console.log('EVENT', 'session_update');

			if (error) {
				throw error;
			}
		});

		this.connector.on('call_request', async (error, payload) => {
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

		this.connector.on('connect', (error, payload) => {
			console.log('EVENT', 'connect', payload);

			if (error) {
				throw error;
			}

			log.info('connected');
		});

		this.connector.on('disconnect', (error, payload) => {
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

	async handleTransaction({ id, method, params }) {
		const rawTx = params[0];
		rawTx.nonce = await this.web3Service.getNextNonce(rawTx.from);
		const tx = { ...rawTx };
		tx.gas = EthUtils.hexToDecimal(tx.gas);
		tx.gasPrice = EthUtils.hexToDecimal(tx.gasPrice);
		if (tx.value) tx.value = EthUtils.hexToDecimal(tx.value);
		this.focusWindow();
		this.store.dispatch(
			walletConnectOperations.transactionOperation(
				id,
				this.peerMeta,
				this.peerId,
				tx,
				method,
				rawTx
			)
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

	approveSession(address) {
		if (!this.connector) {
			throw new Error('Not connected');
		}
		this.connector.approveSession({
			chainId: this.config.chainId,
			accounts: [address]
		});
	}

	rejectSession() {
		if (this.connector) {
			this.connector.rejectSession();
		}
	}

	killSession() {
		if (this.connector) {
			this.connector.killSession();
		}
	}
}

export default WalletConnectService;
