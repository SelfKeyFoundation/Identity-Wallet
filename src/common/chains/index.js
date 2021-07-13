import config from 'common/config';
// import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';

export const initialState = {
	chainId: config.chainId
};

export const chainTypes = {
	CHAIN_SET: 'chains/SET'
};

export const chainActions = {
	setChain: chainId => ({
		type: chainTypes.CHAIN_SET,
		payload: chainId
	})
};

const setChainOperation = chainId => async (dispatch, getState) => {
	// TODO: check chainId
	await dispatch(chainActions.setChain(chainId));
};

export const chainOperations = {
	...chainActions,
	setChainOperation: createAliasedAction(chainTypes.CHAIN_SET, setChainOperation)
};

// Reducers
const setChainReducer = (state, action) => {
	return { ...state, chainId: action.payload };
};

export const chainReducers = {
	setChainReducer
};

export const reducer = (state = initialState, action) => {
	switch (action.type) {
		case chainTypes.CHAIN_SET:
			return chainReducers.setChainReducer(state, action);
	}
	return state;
};

// Selectors
export const chainSelectors = {
	selectRoot: state => state.chain,
	selectChainId: state => chainSelectors.selectRoot(state).chainId,
	selectChain: state => {
		const chainId = chainSelectors.selectRoot(state).chainId;
		return config.chains[chainId];
	}
};

export default reducer;
