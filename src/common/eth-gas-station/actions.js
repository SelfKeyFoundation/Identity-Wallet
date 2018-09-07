import * as types from './types';
import { createAliasedAction } from 'electron-redux';

const updateData = createAliasedAction(types.DATA_UPDATE, data => ({
	type: types.DATA_UPDATE,
	payload: data
}));

export { updateData };
