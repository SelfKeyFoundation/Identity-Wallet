import * as types from './types';

const setTokens = tokens => {
	return {
		type: types.TOKENS_SET,
		payload: tokens
	};
};

export { setTokens };
