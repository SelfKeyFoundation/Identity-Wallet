import * as types from './types';

const localeUpdate = locale => ({
	type: types.UPDATE_LOCALE,
	payload: locale
});

export { localeUpdate };
