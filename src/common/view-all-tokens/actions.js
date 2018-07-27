import * as types from './types';

const toggleViewAll = viewAll => ({
	type: types.VIEW_ALL_TOKENS_TOOGLE,
	payload: viewAll
});

export { toggleViewAll };
