import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';
import { push } from 'connected-react-router';
import { getWallet } from '../wallet/selectors';
import { getTransactionCount } from 'common/transaction/operations';
import { Logger } from 'common/logger';
const log = new Logger('WalletConnectDuck');

let hardwalletConfirmationTimeout = null;

export const walletConnectInitialState = {
	confirmConnection: null,
	uri: null,
	isLoading: false,
	pendingUri: null,
	unlocked: false,
	sessions: [],
	nonce: null,
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
	WALLET_CONNECT_HANDLE_URI_OPERATION: 'wallet-connect/session/operation/HANDLE_URI',
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
	WALLET_CONNECT_SESSION_RESET: 'wallet-connect/session/RESET',
	WALLET_CONNECT_URI_SET: 'wallet-connect/uri/SET',
	WALLET_CONNECT_CONFIRM_CONNECTION_SET: 'wallet-connect/confirm/connection/SET',
	WALLET_CONNECT_SESSIONS_LOAD_OPERATION: 'wallet-connect/sessions/operation/LOAD',
	WALLET_CONNECT_SESSIONS_SET: 'wallet-connect/sessions/SET',
	WALLET_CONNECT_SESSION_DELETE_OPERATION: 'wallet-connet/session/DELETE',
	WALLET_CONNECT_SCAN_QR_CODE_OPERATION: 'wallet-connect/session/qr-code/SCAN'
};

export const walletConnectActions = {
	setSessionAction: payload => ({
		type: walletConnectTypes.WALLET_CONNECT_SESSION_SET,
		payload
	}),
	resetSessionAction: payload => ({
		type: walletConnectTypes.WALLET_CONNECT_SESSION_RESET,
		payload
	}),
	setUri: payload => ({
		type: walletConnectTypes.WALLET_CONNECT_URI_SET,
		payload
	}),
	setConfirmConnection: payload => ({
		type: walletConnectTypes.WALLET_CONNECT_CONFIRM_CONNECTION_SET,
		payload
	}),
	setSessions: payload => ({
		type: walletConnectTypes.WALLET_CONNECT_SESSIONS_SET,
		payload
	})
};

export const reducers = {
	setSessionRequestReducer: (state, { payload }) => {
		return { ...state, ...payload };
	},
	resetSessionReducer: () => {
		return { ...walletConnectInitialState };
	},
	setUriReducer: (state, action) => {
		return { ...state, uri: action.payload };
	},
	setConfirmConnectionReducer: (state, action) => {
		return { ...state, confirmConnection: action.payload };
	},
	setSessionsReducer: (state, action) => {
		return { ...state, sessions: action.payload };
	}
};

export const operations = {
	...walletConnectActions,

	handleUri: uri => async (dispatch, getState) => {
		// const wallet = getWallet(getState());
		const { walletConnectService } = getGlobalContext();
		await dispatch(operations.setSessionAction({ isLoading: true }));
		await walletConnectService.handleSession(uri);
	},
	loadSessions: () => async (dispatch, getState) => {
		const { walletConnectService } = getGlobalContext();
		const sessions = await walletConnectService.getSessions();
		dispatch(walletConnectActions.setSessions(sessions));
	},
	deleteSession: session => async (dispatch, getState) => {
		const { walletConnectService } = getGlobalContext();
		if (!session || !session.id) throw new Error('No session id found');
		await walletConnectService.killSession(session.id);
		console.log(session.id);
		dispatch(operations.loadSessions);
	},
	sessionRequestOperation: (peerId, peerMeta, uri, confirmConnection) => async (
		dispatch,
		getState
	) => {
		await dispatch(operations.resetSessionAction());
		await dispatch(
			operations.setSessionAction({
				hasSessionRequest: true,
				peerId,
				peerMeta,
				uri,
				confirmConnection,
				isLoading: false
			})
		);
		await dispatch(push('/wallet-connect/approve-session'));
	},
	sessionRequestDenyOperation: () => async (dispatch, getState) => {
		const wallet = getWallet(getState());
		const { walletConnectService } = getGlobalContext();
		if (!wallet) throw new Error('No wallet selected');

		const { uri } = walletConnectSelectors.selectWalletConnect(getState());
		if (!uri) throw new Error('No wc URI detected');

		await walletConnectService.rejectSession(uri);
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

		const { peerMeta, uri, confirmConnection } = walletConnectSelectors.selectWalletConnect(
			getState()
		);
		if (!confirmConnection) throw new Error('No wc confirm connection detected');
		if (!uri) throw new Error('No wc URI detected');

		const session = await walletConnectService.approveSession(
			wallet.address,
			uri,
			confirmConnection,
			peerMeta
		);
		if (!session) throw new Error('WalletConnect session not detected');

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
	signMessageDenyOperation: error => async (dispatch, getState) => {
		try {
			const wc = walletConnectSelectors.selectWalletConnect(getState());
			const { walletConnectService } = getGlobalContext();
			walletConnectService.rejectRequest(wc.requestId, error);
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
				await dispatch(walletConnectOperations.signMessageDenyOperation(error));
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
		const nonce = await getTransactionCount(wallet.address);
		await dispatch(operations.resetSessionAction());
		await dispatch(
			operations.setSessionAction({
				hasTxRequest: true,
				requestId,
				peerMeta,
				peerId,
				tx,
				method,
				rawTx,
				nonce
			})
		);
		await dispatch(push('/wallet-connect/transaction'));
	},
	transactionDenyOperation: error => async (dispatch, getState) => {
		try {
			const wc = walletConnectSelectors.selectWalletConnect(getState());
			const { walletConnectService } = getGlobalContext();
			walletConnectService.rejectRequest(wc.requestId, error);
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
				await dispatch(walletConnectOperations.transactionDenyOperation(error));
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
	scanQRCode: () => async (dispatch, getState) => {
		try {
			const { walletConnectService } = getGlobalContext();
			walletConnectService.scanQrCode();
		} catch (error) {
			log.error(error);
			throw error;
		}
	}
};

export const walletConnectOperations = {
	...walletConnectActions,
	handleUriOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_HANDLE_URI_OPERATION,
		operations.handleUri
	),
	loadSessionsOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_SESSIONS_LOAD_OPERATION,
		operations.loadSessions
	),
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
	),
	deleteSessionOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_SESSION_DELETE_OPERATION,
		operations.deleteSession
	),
	scanQRCodeOperation: createAliasedAction(
		walletConnectTypes.WALLET_CONNECT_SCAN_QR_CODE_OPERATION,
		operations.scanQRCode
	)
};

export const walletConnectSelectors = {
	selectWalletConnect: state => state.walletConnect,
	selectUri: state => walletConnectSelectors.selectWalletConnect(state).uri,
	selectConfirmConnection: state =>
		walletConnectSelectors.selectWalletConnect(state).confirmConnection,
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
		case walletConnectTypes.WALLET_CONNECT_URI_SET:
			return reducers.setUriReducer(state, action);
		case walletConnectTypes.WALLET_CONNECT_CONFIRM_CONNECTION_SET:
			return reducers.setConfirmConnectionReducer(state, action);
		case walletConnectTypes.WALLET_CONNECT_SESSIONS_SET:
			return reducers.setSessionsReducer(state, action);
	}
	return state;
};

export default walletConnectReducer;
