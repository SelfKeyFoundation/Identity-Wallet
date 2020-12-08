import { getGlobalContext } from '../context';
import { createAliasedAction } from 'electron-redux';

import { push } from 'connected-react-router';
import { getWallet } from '../wallet/selectors';

export const walletConnectInitialState = {
	hasSessionRequest: false,
	peerMeta: {},
	peerId: null
};

export const walletConnectTypes = {
	WALLET_CONNECT_SESSION_REQUEST_OPERATION: 'wallet-connect/session/operation/REQUEST',
	WALLET_CONNECT_SESSION_REQUEST_APPROVE_OPERATION:
		'wallet-connect/session/operation/REQUEST_APPROVE',
	WALLET_CONNECT_SESSION_REQUEST_DENY_OPERATION: 'wallet-connect/session/operation/REQUEST_DENY',
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
		if (wallet) {
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
	)
};

export const walletConnectSelectors = {
	selectWalletConnect: state => state.walletConnect,
	hasSessionRequest: state => walletConnectSelectors.selectWalletConnect(state).hasSessionRequest
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
