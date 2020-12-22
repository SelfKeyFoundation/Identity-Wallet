import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { createAliasedAction } from 'electron-redux';

export const createAliasedSlice = ({ aliasedOperations = {}, operations = {}, ...slice }) => {
	const created = createSlice(slice);

	let rawOperations = { ...operations, ...aliasedOperations };
	let exportedOperations;

	rawOperations = {
		...created.actions,
		..._.mapValues(rawOperations, op => op(exportedOperations))
	};

	aliasedOperations = _.mapValues(aliasedOperations, (op, name) => {
		const type = `${slice.name}/operations/${name}`;
		return createAliasedAction(type, op(exportedOperations));
	});

	exportedOperations = { ...rawOperations, ...aliasedOperations };

	return { ...created, operations, rawOperations };
};
