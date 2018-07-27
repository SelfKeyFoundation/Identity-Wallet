import * as types from './types';

const localeUpdate = locale => ({
	type: types.LOCALE_UPDATE,
	payload: locale
});

export { localeUpdate };
