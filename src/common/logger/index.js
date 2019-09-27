/* istanbul ignore file */
if (!process.env.STORYBOOK) {
	const confInit = require('./config').init;

	confInit();
}

import Logger from './logger';

if (process.env.STORYBOOK) {
	Logger.prototype.log = console.log.bind(console);
}

export const createLog = prefix => new Logger(prefix);

export { Logger };

export default createLog;
