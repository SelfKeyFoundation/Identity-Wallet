import * as types from './types';
// import { createAliasedAction } from 'electron-redux';

const dataLoaded = data => ({
	type: types.INCORPORATIONS_DATA_LOADED,
	payload: data
});

const openDetails = data => ({
	type: types.INCORPORATIONS_OPEN_DETAILS,
	payload: data
});

export { dataLoaded, openDetails };
