import log from 'electron-log';
import { vsprintf } from 'sprintf-js';
import { is } from 'electron-util';

const DEFAULT_LOG_LEVEL = process.env.NODE_ENV === 'development' ? 'info' : 'warn';

const LOG_LEVEL_CONSOLE =
	process.env.LOG_LEVEL_CONSOLE || process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
const LOG_LEVEL_FILE = process.env.LOG_LEVEL_FILE || process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL;
const LOG_FILTER = process.env.LOG_FILTER || null;
const LOG_FILTER_LEVEL = process.env.LOG_FILTER_LEVEL || null;

const FMT_TPL = '{y}-{m}-{d} {h}:{i}:{s}:{ms} {text}';
const LEVELS = ['error', 'warn', 'info', 'verbose', 'debug', 'trace'];

if (is.main) {
	log.transports.console.level = LOG_LEVEL_CONSOLE === 'trace' ? 'silly' : LOG_LEVEL_CONSOLE;
	log.transports.console.format = FMT_TPL;

	log.transports.file.level = LOG_LEVEL_FILE === 'trace' ? 'silly' : LOG_LEVEL_FILE;
	log.transports.file.format = FMT_TPL;
}

export const compareLevels = (passLevel, checkLevel) => {
	const pass = LEVELS.indexOf(passLevel);
	const check = LEVELS.indexOf(checkLevel);
	if (check === -1 || pass === -1) {
		return true;
	}
	return check <= pass;
};

export const processPrefix = is.main ? 'MAIN' : 'RENDERER';

export const createFilter = (filters, levels) => {
	if (!filters) return () => false;

	try {
		filters = filters.split(',').map(f => new RegExp(f));
	} catch (error) {
		log.error(`${processPrefix}:logger ${Logger.errToStr(error)}`);
	}

	if (levels) {
		levels.split(',');
	}

	return (level, msg) => {
		if (levels && !levels.contains(level)) {
			return false;
		}
		for (let filter of filters) {
			if (msg.match(filter)) return false;
		}
		return true;
	};
};

export const globalFilter = createFilter(LOG_FILTER, LOG_FILTER_LEVEL);

export class Logger {
	constructor(prefix = 'general', filter = null) {
		this.prefix = `${processPrefix}:${prefix}`;
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
		if (stackStr.startsWith(errStr)) return stackStr;
		return errStr;
	}

	static checkLevels(level) {
		for (let tlevel of [LOG_LEVEL_CONSOLE, LOG_LEVEL_FILE]) {
			if (compareLevels(tlevel, level)) return true;
		}
	}

	fmtMessage(level, msg, args) {
		if (msg instanceof Error) {
			msg = this.constructor.errToStr(msg);
		}
		args = args.map(e => (e instanceof Error ? this.constructor.errToStr(e) : e));
		msg = vsprintf(msg, args);
		if (!this.prefix) return msg;
		return `${level.toUpperCase()}: ${this.prefix} ${msg}`;
	}

	isFiltered(level, msg = '') {
		return this.filter(level, msg);
	}

	logMessage(level, msg, args) {
		if (!this.constructor.checkLevels(level)) return;
		msg = this.fmtMessage(level, msg, args);
		if (this.isFiltered(level, msg)) return;
		const log = this.constructor.getRawLogger();
		if (level === 'trace') level = 'silly';
		log[level](msg);
	}

	info(msg, ...args) {
		this.logMessage('info', msg, args);
	}

	warn(msg, ...args) {
		this.logMessage('warn', msg, args);
	}

	error(msg, ...args) {
		this.logMessage('error', msg, args);
	}

	verbose(msg, ...args) {
		this.logMessage('verbose', msg, args);
	}

	debug(msg, ...args) {
		this.logMessage('debug', msg, args);
	}

	trace(msg, ...args) {
		this.logMessage('trace', msg, args);
	}
}

export default Logger;
