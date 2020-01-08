/* istanbul ignore file */
import { isStorybook } from 'common/utils/common';
if (!isStorybook()) {
	const confInit = require('./config').init;

	confInit();
}

import Logger from './logger';

if (isStorybook()) {
	Logger.prototype.log = console.log.bind(console);
}

export const createLog = prefix => new Logger(prefix);

export { Logger };

export default createLog;
