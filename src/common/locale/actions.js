import * as types from './types';

const localeUpdate = locale => ({
	type: types.LOCALE_UPDATE,
	locale
});

export { localeUpdate };
