import * as types from './types';

const updateTokens = tokens => {
	return {
		type: types.TOKENS_UPDATE,
		payload: tokens
	};
};

export { updateTokens };
