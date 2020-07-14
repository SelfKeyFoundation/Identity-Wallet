import { identitySelectors, identityOperations } from '../identity';
import { push } from 'connected-react-router';
import { createAliasedAction } from 'electron-redux';
import { appSelectors } from '../app';
import { walletSelectors } from '../wallet';
import { getGlobalContext } from 'common/context';

const hardwalletConfirmationTime = 30000;

export const initialState = {
	associateError: null,
	originUrl: null,
	pending: {}
};

export const didTypes = {
	DID_CREATE: 'did/CREATE',
	DID_UPDATE: 'did/UPDATE',
	DID_ASSOCIATE_ERROR_SET: 'did/associate/SET',
	DID_ORIGIN_URL_SET: 'did/origin_url/SET',
	DID_PENDING_SET: 'did/pending/SET',
	DID_CREATE_FLOW_START: 'did/flow/create/START',
	DID_ASSOCIATE_FLOW_START: 'did/flow/associate/START'
};

export const didActions = {
	setOriginUrlAction: url => ({
		type: didTypes.DID_ORIGIN_URL_SET,
		payload: url
	}),
	setAssociateError: error => ({
		type: didTypes.DID_ASSOCIATE_ERROR_SET,
		payload: error
	}),
	setDidPending: (identityId, isPending) => ({
		type: didTypes.DID_PENDING_SET,
		payload: { identityId, isPending }
	})
};

export const didSelectors = {
	selectDIDTree: state => state.did,
	selectOriginUrl: state => didSelectors.selectDIDTree(state).originUrl,
	selectAssociateError: state => didSelectors.selectDIDTree(state).associateError,
	isPending: (state, identityId) => !!didSelectors.selectDIDTree(state).pending[identityId],
	isCurrentIdentityPending: state => {
		const identity = identitySelectors.selectIdentity(state);
		return didSelectors.isPending(state, identity.id);
	}
};

const createDIDOperation = () => async (dispatch, getState) => {
	const walletFromStore = walletSelectors.getWallet(getState());
	let identity = identitySelectors.selectIdentity(getState());
	const didOriginUrl = didSelectors.selectOriginUrl(getState());
	try {
		let hardwalletConfirmationTimeout = null;
		const walletType = appSelectors.selectWalletType(getState());
		if (walletType === 'ledger' || walletType === 'trezor') {
			await dispatch(push('/main/hd-transaction-timer'));
			hardwalletConfirmationTimeout = setTimeout(async () => {
				clearTimeout(hardwalletConfirmationTimeout);
				await dispatch(push('/main/transaction-timeout'));
			}, hardwalletConfirmationTime);
		}

		const { didService, matomoService } = getGlobalContext();
		await dispatch(didActions.setDidPending(identity.id, true));
		const gasLimit = await didService.getGasLimit(walletFromStore.address);
		const transaction = didService.createDID(walletFromStore.address, gasLimit);
		transaction.on('receipt', async receipt => {
			const did = receipt.events.CreatedDID.returnValues.id;
			const identityService = getGlobalContext().identityService;
			identity = await identityService.updateIdentityDID(did, identity.id);

			await dispatch(didActions.setDidPending(identity.id, false));

			await dispatch(identityOperations.updateIdentity(identity));
			const goal =
				identity.type === 'corporate'
					? matomoService.goals.CreateCorporateDID
					: matomoService.goals.CreateIndividualDID;
			matomoService.trackGoal(goal);
			await dispatch(push(didOriginUrl));
		});
		transaction.on('transactionHash', async hash => {
			clearTimeout(hardwalletConfirmationTimeout);
			await dispatch(push('/main/create-did-processing'));
		});
		transaction.on('error', async error => {
			clearTimeout(hardwalletConfirmationTimeout);
			const message = error.toString().toLowerCase();
			if (message.indexOf('insufficient funds') !== -1) {
				await dispatch(push('/main/transaction-no-gas-error'));
			} else if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
				await dispatch(push('/main/transaction-declined/Ledger'));
			} else if (error.code === 'Failure_ActionCancelled') {
				await dispatch(push('/main/transaction-declined/Trezor'));
			} else if (error.statusText === 'UNKNOWN_ERROR') {
				await dispatch(push('/main/transaction-unlock'));
			} else {
				await dispatch(push('/main/transaction-error'));
			}
			await dispatch(didActions.setDidPending(identity.id, false));
			console.error(error);
		});
	} catch (error) {
		await dispatch(didActions.setDidPending(identity.id, false));
		console.error(error);
	}
};

const startCreateDidFlowOperation = didOriginUrl => async (dispatch, getState) => {
	await dispatch(didActions.setOriginUrlAction(didOriginUrl));
	await dispatch(push('/main/get-did'));
};

const startAssociateDidFlowOperation = didOriginUrl => async (dispatch, getState) => {
	await dispatch(didActions.setOriginUrlAction(didOriginUrl));
	await dispatch(push('/main/enter-did'));
};

const updateDIDOperation = did => async (dispatch, getState) => {
	try {
		const walletFromStore = walletSelectors.getWallet(getState());
		let identity = identitySelectors.selectIdentity(getState());
		const DIDService = getGlobalContext().didService;
		const controllerAddress = await DIDService.getControllerAddress(did);
		if (walletFromStore.address.toLowerCase() === controllerAddress.toLowerCase()) {
			const identityService = getGlobalContext().identityService;
			identity = await identityService.updateIdentityDID(did, identity.id);
			await dispatch(identityOperations.updateIdentity(identity));
			await dispatch(didActions.setAssociateError('none'));
		} else {
			await dispatch(
				didActions.setAssociateError(
					'The DID provided is not derived from the current wallet.'
				)
			);
		}
	} catch (error) {
		console.error(error);
		await dispatch(didActions.setAssociateError('Invalid DID'));
	}
};

const resetAssociateDIDOperation = () => async dispatch => {
	await dispatch(didActions.setAssociateError(''));
};

export const didOperations = {
	createDIDOperation: createAliasedAction(didTypes.DID_CREATE, createDIDOperation),
	startCreateDidFlowOperation: createAliasedAction(
		didTypes.DID_CREATE_FLOW_START,
		startCreateDidFlowOperation
	),
	startAssociateDidFlowOperation: createAliasedAction(
		didTypes.DID_ASSOCIATE_FLOW_START,
		startAssociateDidFlowOperation
	),
	updateDIDOperation: createAliasedAction(didTypes.DID_UPDATE, updateDIDOperation),
	resetAssociateDIDOperation
};

export const didReducers = {
	setDidPendingReducer: (state, action) => {
		const { identityId, isPending } = action.payload;
		const pending = { ...state.pending, [identityId]: isPending };
		return { ...state, pending };
	},
	setAssociateErrorReducer: (state, action) => {
		const associateError = action.payload;
		return { ...state, associateError };
	},
	setOriginUrlReducer: (state, action) => {
		const originUrl = action.payload;
		return { ...state, originUrl };
	}
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case didTypes.DID_ORIGIN_URL_SET:
			return didReducers.setOriginUrlReducer(state, action);
		case didTypes.DID_PENDING_SET:
			return didReducers.setDidPendingReducer(state, action);
		case didTypes.DID_ASSOCIATE_ERROR_SET:
			return didReducers.setAssociateErrorReducer(state, action);
	}
	return state;
};

export default reducer;
