import * as types from './types';

const toggleViewAll = viewAll => ({
	type: types.TOGGLE_VIEW_ALL,
	payload: viewAll
});

export { toggleViewAll };
