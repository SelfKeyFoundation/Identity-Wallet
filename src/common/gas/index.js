import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from '../wallet';
import { Logger } from 'common/logger';

const log = new Logger('gas-redux');

export const initialState = {
	didGasLimit: 0
};

export const gasTypes = {
	GAS_SET_DID_GAS_LIMIT: 'gas/set/did/gas/LIMIT',
	GAS_LOAD_DID_GAS_LIMIT: 'gas/load/did/gas/LIMIT'
};

const gasActions = {
	setDIDGasLimitAction: didGasLimit => ({
		type: gasTypes.GAS_SET_DID_GAS_LIMIT,
		payload: didGasLimit
	})
};

const loadDIDGasLimit = () => async (dispatch, getState) => {
	const wallet = walletSelectors.getWallet(getState());
	try {
		const didService = getGlobalContext().didService;
		const gasLimit = await didService.getGasLimit(wallet.address);
		await dispatch(gasActions.setDIDGasLimitAction(gasLimit));
	} catch (e) {
		log.error(e);
	}
};

const operations = {
	loadDIDGasLimit
};

const gasOperations = {
	...gasActions,
	loadDIDGasLimitOperation: createAliasedAction(
		gasTypes.GAS_LOAD_DID_GAS_LIMIT,
		operations.loadDIDGasLimit
	)
};

const setDIDGasLimitReducer = (state, action) => {
	return { ...state, didGasLimit: action.payload };
};

const gasReducers = {
	setDIDGasLimitReducer
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case gasTypes.GAS_SET_DID_GAS_LIMIT:
			return gasReducers.setDIDGasLimitReducer(state, action);
	}
	return state;
};

const selectGas = state => state.gas;

const gasSelectors = {
	selectGas
};

export { gasSelectors, gasReducers, gasActions, gasOperations };

export default reducer;
