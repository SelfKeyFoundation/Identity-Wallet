import * as types from './types';

const setTokens = tokens => {
	return {
		type: types.TOKENS_SET,
		payload: tokens
	};
};

const setTokenError = error => ({
	type: types.TOKENS_TOKEN_ERROR_SET,
	payload: error
});

export { setTokens, setTokenError };
