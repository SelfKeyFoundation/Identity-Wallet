import * as actions from './actions';
import * as types from './types';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';

const loadTokens = () => async (dispatch, getState) => {
	const tokenService = getGlobalContext().tokenService;
	const tokens = await tokenService.loadTokens();
	dispatch(actions.setTokens(tokens));
};

const addToken = contractAddress => async dispatch => {
	const tokenService = getGlobalContext().tokenService;
	const tokenInfo = await tokenService.getTokenInfo(contractAddress);
	await tokenService.addToken(tokenInfo);
	dispatch(loadTokens());
};

export default {
	...actions,
	loadTokensOperation: createAliasedAction(types.TOKENS_LOAD, loadTokens),
	addTokenOperation: createAliasedAction(types.TOKENS_ADD, addToken)
};
