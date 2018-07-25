import * as types from './types';

const updateTokens = tokens => {
	return {
		type: types.UPDATE_TOKENS,
		payload: tokens
	};
};

const toggleViewAll = viewAll => ({
	type: types.TOGGLE_VIEW_ALL,
	payload: viewAll
});

export { updateTokens, toggleViewAll };
