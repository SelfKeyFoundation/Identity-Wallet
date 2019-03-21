/* istanbul ignore file */
import { Logger } from '../common/logger';
import path from 'path';
import config from 'common/config';

const log = new Logger('app');

export const createApp = () => {
	const app = {
		dir: {
			root: path.join(__dirname, '..'),
			desktopApp: path.join(__dirname, '..', 'app')
		},
		config: {
			app: config,
			user: null
		},
		translations: {},
		win: null,
		log: log
	};
	const i18n = ['en'];
	for (let i in i18n) {
		app.translations[i18n[i]] = require(`../common/locale/i18n/${i18n[i]}.js`);
	}
	return app;
};

export default createApp;
