import * as actions from './actions';
import * as types from './types';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';

const loadTokens = () => async (dispatch, getState) => {
	const tokenService = getGlobalContext().tokenService;
	const tokens = await tokenService.loadTokens();
	dispatch(actions.setTokens(tokens));
};

export default {
	...actions,
	loadTokensOperation: createAliasedAction(types.TOKENS_LOAD, loadTokens)
};
