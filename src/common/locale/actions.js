import * as types from './types';

const localeUpdate = locale => ({
	type: types.UPDATE_LOCALE,
	locale
});

export { localeUpdate };
