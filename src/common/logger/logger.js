import { vsprintf } from 'sprintf-js';
import { errToStr, compareLevels } from './utils';
import globalConfig, { init as initConfig } from './config';
import elog from 'electron-log';

export class Logger {
	constructor(prefix) {
		this.processPrefix = this.globalConfig.processPrefix;
		this.prefix = `${this.processPrefix}:${prefix || this.config.prefix}`;
		this.filter = this.globalConfig.filterFn || (() => false);
	}
	get globalConfig() {
		return globalConfig;
	}
	set globalConfig(conf) {
		initConfig(conf);
	}
	checkLevels(level) {
		for (let tlevel of [this.globalConfig.logLevelConsole, this.globalConfig.logLevelFile]) {
			if (compareLevels(tlevel, level)) return true;
		}
		return false;
	}
	fmtMessage(level, msg, args) {
		if (msg instanceof Error) {
			msg = errToStr(msg);
		}
		args = args.map(e => (e instanceof Error ? errToStr(e) : e));
		msg = vsprintf(msg, args);
		if (!this.prefix) return msg;
		return `${level.toUpperCase()}: ${this.prefix} ${msg}`;
	}

	isFiltered(level, msg = '') {
		return this.filter(level, msg);
	}

	log(level, msg, ...args) {
		if (!this.checkLevels(level)) return;
		msg = this.fmtMessage(level, msg, args);
		if (this.isFiltered(level, msg)) return;
		if (level === 'trace') level = 'silly';
		elog[level](msg);
	}

	info(msg, ...args) {
		this.log('info', msg, ...args);
	}

	warn(msg, ...args) {
		this.log('warn', msg, ...args);
	}

	error(msg, ...args) {
		this.log('error', msg, ...args);
	}

	verbose(msg, ...args) {
		this.log('verbose', msg, ...args);
	}

	debug(msg, ...args) {
		this.log('debug', msg, ...args);
	}

	trace(msg, ...args) {
		this.log('trace', msg, ...args);
	}
}

export default Logger;
