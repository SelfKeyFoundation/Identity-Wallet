import * as actions from './actions';
import * as types from './types';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { Logger } from 'common/logger';

const log = new Logger('tokens-duck');

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
	} catch (e) {
		log.error(e);
		await dispatch(
			actions.setTokenError(
				`Sorry, an error occurred while adding the provided token. Please try again later.`
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
