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
	try {
		const tokenInfo = await tokenService.getTokenInfo(contractAddress);
		await tokenService.addToken(tokenInfo);
	} catch (error) {
		await dispatch(
			actions.setTokenError(
				`Sorry, an error occurred while adding the current token: ${error}`
			)
		);
	}
	dispatch(loadTokens());
};

const resetTokenError = () => async dispatch => {
	await dispatch(actions.setTokenError(''));
};

export default {
	...actions,
	loadTokensOperation: createAliasedAction(types.TOKENS_LOAD, loadTokens),
	addTokenOperation: createAliasedAction(types.TOKENS_ADD, addToken),
	resetTokenError
};
