import log from 'electron-log';
import { is } from 'electron-util';

const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'development' ? 'info' : 'warn';

const LOG_LEVEL_CONSOLE =
	process.env.LOG_LEVEL_CONSOLE || process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
const LOG_LEVEL_FILE = process.env.LOG_LEVEL_FILE || process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
const LOG_FILTER = process.env.LOG_FILTER || null;
const LOG_FILTER_LEVEL = process.env.LOG_FILTER_LEVEL || null;

const FMT_TPL = '{y}-{m}-{d} {h}:{i}:{s}:{ms} {level}: {text}';

if (is.main) {
	log.transports.console.level = LOG_LEVEL_CONSOLE;
	log.transports.console.format = FMT_TPL;

	log.transports.file.level = LOG_LEVEL_FILE;
	log.transports.file.format = FMT_TPL;
}

export const processPrefix = is.main ? 'MAIN' : 'RENDERER';

export const createFilter = (filters, levels) => {
	if (!filters) return () => false;

	try {
		filters = filters.split(',').map(f => new RegExp(f));
	} catch (error) {
		log.error(`Logger -> ${Logger.errToStr(error)}`);
	}

	if (levels) {
		levels.split(',');
	}

	return (level, msg) => {
		if (levels && !levels.contains(level)) {
			return false;
		}
		for (let filter of filters) {
			if (filter.match(msg)) return false;
		}
		return true;
	};
};

export const globalFilter = createFilter(LOG_FILTER, LOG_FILTER_LEVEL);

export class Logger {
	constructor(prefix = 'general', filter = null) {
		this.prefix = `${processPrefix} > ${prefix}`;
		this.filter = filter || globalFilter;
	}

	static getRawLogger() {
		return log;
	}

	static errToStr(error) {
		const hasStack = error instanceof Error && error.stack;
		const errStr = '' + error;
		if (!hasStack) return errStr;
		const stackStr = '' + error.stack;
		if (stackStr.startsWith(errStr)) return errStr;
		return errStr;
	}

	fmtMessage(msg) {
		if (!this.prefix) return msg;
		return `${this.prefix} -> ${msg}`;
	}

	isFiltered(level, msg = '') {
		return this.filter(level, msg);
	}

	logMessage(level, msg) {
		if (msg instanceof Error) {
			msg = this.constructor.errToStr(msg);
		}

		msg = this.fmtMessage(msg);
		if (this.isFiltered(level, msg)) return;
		const log = this.constructor.getRawLogger();
		log[level](msg);
	}

	info(msg) {
		this.logMessage('info', msg);
	}

	warn(msg) {
		this.logMessage('warn', msg);
	}

	error(msg) {
		this.logMessage('error', msg);
	}

	verbose(msg) {
		this.logMessage('verbose', msg);
	}

	debug(msg) {
		this.logMessage('debug', msg);
	}

	silly(msg) {
		this.logMessage('silly', msg);
	}
}

export default Logger;
