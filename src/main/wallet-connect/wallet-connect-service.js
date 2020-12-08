import WalletConnect from '@walletconnect/client';
import { Logger } from 'common/logger';
import { walletConnectOperations } from '../../common/wallet-connect';
const log = new Logger('WalletConnectService');

export class WalletConnectService {
	HANDLER_NAME = 'wallet-connect';

	constructor({ config, store }) {
		this.config = config;
		this.store = store;
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

			// perform call
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
