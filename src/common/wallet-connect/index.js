import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';
import { push } from 'connected-react-router';
import { getWallet } from '../wallet/selectors';
import { Logger } from 'common/logger';
const log = new Logger('WalletConnectDuck');

let hardwalletConfirmationTimeout = null;

export const walletConnectInitialState = {
	hasSessionRequest: false,
	hasSignRequest: false,
	hasTxRequest: false,
	peerMeta: {},
	peerId: null,
	requestId: null,
	message: null,
	tx: {},
	method: null,
	rawTx: null
};

export const walletConnectTypes = {
	WALLET_CONNECT_SESSION_REQUEST_OPERATION: 'wallet-connect/session/operation/REQUEST',
	WALLET_CONNECT_SESSION_REQUEST_APPROVE_OPERATION:
		'wallet-connect/session/operation/REQUEST_APPROVE',
	WALLET_CONNECT_SESSION_REQUEST_DENY_OPERATION: 'wallet-connect/session/operation/REQUEST_DENY',
	WALLET_CONNECT_SIGN_MESSAGE_OPERATION: 'wallet-connect/message/operation/SIGN',
	WALLET_CONNECT_SIGN_MESSAGE_DENY_OPERATION: 'wallet-connect/message/operation/SIGN_DENY',
	WALLET_CONNECT_SIGN_MESSAGE_APPROVE_OPERATION: 'wallet-connect/message/operation/SIGN_APPROVE',
	WALLET_CONNECT_TRANSACTION_OPERATION: 'wallet-connect/transaction/operation/REQUEST',
	WALLET_CONNECT_TRANSACTION_DENY_OPERATION: 'wallet-connect/transaction/operation/DENY',
	WALLET_CONNECT_TRANSACTION_APPROVE_OPERATION: 'wallet-connect/transaction/operation/APPROVE',
	WALLET_CONNECT_SESSION_SET: 'wallet-connect/session/SET',
	WALLET_CONNECT_SESSION_RESET: 'wallet-connect/session/RESET'
};

export const walletConnectActions = {
	setSessionAction: payload => ({
		type: walletConnectTypes.WALLET_CONNECT_SESSION_SET,
		payload
	}),
	resetSessionAction: payload => ({
		type: walletConnectTypes.WALLET_CONNECT_SESSION_RESET,
		payload
	})
};

export const reducers = {
	setSessionRequestReducer: (state, { payload }) => {
		return { ...state, ...payload };
	},
	resetSessionReducer: () => {
		return { ...walletConnectInitialState };
	}
};

export const operations = {
	...walletConnectActions,
	sessionRequestOperation: (peerId, peerMeta) => async (dispatch, getState) => {
		await dispatch(operations.resetSessionAction());
		await dispatch(
			operations.setSessionAction({
				hasSessionRequest: true,
				peerId,
				peerMeta
			})
		);
		await dispatch(push('/wallet-connect/approve-session'));
	},
	sessionRequestDenyOperation: () => async (dispatch, getState) => {
		const wallet = getWallet(getState());
		const { walletConnectService } = getGlobalContext();

		walletConnectService.rejectSession();
		await dispatch(operations.resetSessionAction());
		if (wallet && wallet.address) {
			return dispatch(push('/main/dashboard'));
		}

		return dispatch(push('/home'));
	},
	sessionRequestApproveOperation: () => async (dispatch, getState) => {
		const { walletConnectService } = getGlobalContext();
		const wallet = getWallet(getState());
		if (!wallet) throw new Error('No wallet selected');
		walletConnectService.approveSession(wallet.address);
		await dispatch(operations.resetSessionAction());
		return dispatch(push('/main/dashboard'));
	},
	signMessageOperation: (requestId, peerMeta, peerId, message) => async (dispatch, getState) => {
		const wallet = getWallet(getState());
		if (!wallet) {
			throw new Error('Cannot sign message without wallet');
		}
		await dispatch(operations.resetSessionAction());
		await dispatch(
			operations.setSessionAction({
				hasSignRequest: true,
				requestId,
				peerMeta,
				peerId,
				message
			})
		);
		await dispatch(push('/wallet-connect/sign-message'));
	},
	signMessageDenyOperation: () => async (dispatch, getState) => {
		try {
			const wc = walletConnectSelectors.selectWalletConnect(getState());
			const { walletConnectService } = getGlobalContext();
			walletConnectService.rejectRequest(wc.requestId);
			await dispatch(walletConnectOperations.resetSessionAction());
			await dispatch(push('/main/dashboard'));
		} catch (error) {
			log.error(error);
			throw error;
		}
	},
	signMessageApproveOperation: () => async (dispatch, getState) => {
		try {
			const wc = walletConnectSelectors.selectWalletConnect(getState());
			const wallet = getWallet(getState());
			const walletType = wallet.profile;
			const { walletConnectService, walletService } = getGlobalContext();
			let result;
			try {
				if (walletType === 'ledger' || walletType === 'trezor') {
					const hardwalletConfirmationTime = '30000';
					hardwalletConfirmationTimeout = setTimeout(async () => {
						clearTimeout(hardwalletConfirmationTimeout);
						await dispatch(push('/main/hd-timeout'));
					}, hardwalletConfirmationTime);
					await dispatch(push('/main/hd-timer'));
				}
				result = await walletService.signPersonalMessage(wallet, wc.message);
				if (hardwalletConfirmationTimeout) {
					clearTimeout(hardwalletConfirmationTimeout);
				}
			} catch (error) {
				log.error(error);
				if (walletType === 'ledger' || walletType === 'trezor') {
					clearTimeout(hardwalletConfirmationTimeout);
					if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
						await dispatch(push('/main/hd-declined'));
					} else if (error.code === 'Failure_ActionCancelled') {
						await dispatch(push('/main/hd-declined'));
					} else if (error.statusText === 'UNKNOWN_ERROR') {
						await dispatch(push('/main/hd-unlock'));
					} else {
						await dispatch(push('/main/hd-error'));
					}
				}
				walletConnectService.rejectRequest(wc.requestId, error);
				return;
			}

			walletConnectService.approveRequest(wc.requestId, result);
			await dispatch(walletConnectOperations.resetSessionAction());
			await dispatch(push('/main/dashboard'));
		} catch (error) {
			log.error(error);
			throw error;
		}
	},
	transactionOperation: (requestId, peerMeta, peerId, tx, method, rawTx) => async (
		dispatch,
		getState
	) => {
		const wallet = getWallet(getState());
		if (!wallet || !wallet.address) {
			throw new Error('Cannot sign message without wallet');
		}
		await dispatch(operations.resetSessionAction());
		await dispatch(
			operations.setSessionAction({
				hasTxRequest: true,
				requestId,
				peerMeta,
				peerId,
				tx,
				method,
				rawTx
			})
		);
		await dispatch(push('/wallet-connect/transaction'));
	},
	transactionDenyOperation: () => async (dispatch, getState) => {
		try {
			const wc = walletConnectSelectors.selectWalletConnect(getState());
			const { walletConnectService } = getGlobalContext();
			walletConnectService.rejectRequest(wc.requestId);
			await dispatch(walletConnectOperations.resetSessionAction());
			await dispatch(push('/main/dashboard'));
		} catch (error) {
			log.error(error);
			throw error;
		}
	},
	transactionApproveOperation: () => async (dispatch, getState) => {
		try {
			const wc = walletConnectSelectors.selectWalletConnect(getState());
			const wallet = getWallet(getState());
			if (wallet.address.toLowerCase() !== wc.tx.from.toLowerCase()) {
				throw new Error('invalid source address');
			}
			const walletType = wallet.profile;
			const { walletConnectService, walletService } = getGlobalContext();
			let result;
			try {
				if (walletType === 'ledger' || walletType === 'trezor') {
					const hardwalletConfirmationTime = '30000';
					hardwalletConfirmationTimeout = setTimeout(async () => {
						clearTimeout(hardwalletConfirmationTimeout);
						await dispatch(push('/main/hd-timeout'));
					}, hardwalletConfirmationTime);
					await dispatch(push('/main/hd-timer'));
				}
				if (wc.method === 'eth_sendTransaction') {
					result = await new Promise((resolve, reject) => {
						const res = walletService.sendTransaction(wc.rawTx);
						res.on('transactionHash', hash => resolve(hash)).on('error', err =>
							reject(err)
						);
					});
				} else if (wc.method === 'eth_signTransaction') {
					result = await walletService.signTransaction(wc.rawTx);
				} else {
					throw new Error('unsupported transaction method');
				}
				if (hardwalletConfirmationTimeout) {
					clearTimeout(hardwalletConfirmationTimeout);
				}
			} catch (error) {
				log.error(error);
				if (walletType === 'ledger' || walletType === 'trezor') {
					clearTimeout(hardwalletConfirmationTimeout);
					if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
						await dispatch(push('/main/hd-declined'));
					} else if (error.code === 'Failure_ActionCancelled') {
						await dispatch(push('/main/hd-declined'));
					} else if (error.statusText === 'UNKNOWN_ERROR') {
						await dispatch(push('/main/hd-unlock'));
					} else {
						await dispatch(push('/main/hd-error'));
					}
				}
				walletConnectService.rejectRequest(wc.requestId, error);
				return;
			}

			walletConnectService.approveRequest(wc.requestId, result);
			await dispatch(walletConnectOperations.resetSessionAction());
			await dispatch(push('/main/dashboard'));
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
};

export const walletConnectOperations = {
	...walletConnectActions,
	sessionRequestOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_SESSION_REQUEST_OPERATION,
		operations.sessionRequestOperation
	),
	sessionRequestDenyOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_SESSION_REQUEST_DENY_OPERATION,
		operations.sessionRequestDenyOperation
	),
	sessionRequestApproveOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_SESSION_REQUEST_APPROVE_OPERATION,
		operations.sessionRequestApproveOperation
	),
	signMessageOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_SIGN_MESSAGE_OPERATION,
		operations.signMessageOperation
	),
	signMessageDenyOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_SIGN_MESSAGE_DENY_OPERATION,
		operations.signMessageDenyOperation
	),
	signMessageApproveOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_SIGN_MESSAGE_APPROVE_OPERATION,
		operations.signMessageApproveOperation
	),
	transactionOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_TRANSACTION_OPERATION,
		operations.transactionOperation
	),
	transactionDenyOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_TRANSACTION_DENY_OPERATION,
		operations.transactionDenyOperation
	),
	transactionApproveOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_TRANSACTION_APPROVE_OPERATION,
		operations.transactionApproveOperation
	)
};

export const walletConnectSelectors = {
	selectWalletConnect: state => state.walletConnect,
	hasSessionRequest: state => walletConnectSelectors.selectWalletConnect(state).hasSessionRequest,
	hasSignMessageRequest: state =>
		walletConnectSelectors.selectWalletConnect(state).hasSignMessageRequest
};

export const walletConnectReducer = (state = walletConnectInitialState, action) => {
	switch (action.type) {
		case walletConnectTypes.WALLET_CONNECT_SESSION_SET:
			return reducers.setSessionRequestReducer(state, action);
		case walletConnectTypes.WALLET_CONNECT_SESSION_RESET:
			return reducers.resetSessionReducer(state, action);
	}
	return state;
};

export default walletConnectReducer;
