import WalletConnect from '@walletconnect/client';
// import * as ethUtil from 'ethereumjs-util';
import { Logger } from 'common/logger';
import { walletConnectOperations } from '../../common/wallet-connect';
import { Identity } from '../platform/identity';
import { getWallet } from '../../common/wallet/selectors';
import { identitySelectors } from 'common/identity';
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

			switch (payload.method) {
				case 'personal_sign':
					return this.handlePersonalSignRequest(payload);
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

		this.store.dispatch(
			walletConnectOperations.signMessageOperation(id, this.peerMeta, this.peerId, message)
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
