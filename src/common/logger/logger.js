import { vsprintf } from 'sprintf-js';
import { errToStr, compareLevels } from './utils';
import globalConfig, { updateConfig } from './config';
import elog from 'electron-log';
import { captureException, addBreadcrumb } from '@sentry/electron';

export class Logger {
	constructor(name) {
		this.processName = this.globalConfig.processPrefix;
		this.name = name || this.config.prefix;
		this.filter = this.globalConfig.filterFn || (() => false);
	}
	get globalConfig() {
		return globalConfig;
	}
	set globalConfig(conf) {
		updateConfig(conf);
	}
	overrideGlobalLogLevel(level) {
		this.globalConfig = {
			levelOverride: level
		};
	}
	getLogFilePath() {
		return elog.transports.file.findLogPath();
	}
	checkLevels(level) {
		for (let tlevel of [this.globalConfig.logLevelConsole, this.globalConfig.logLevelFile]) {
			if (compareLevels(tlevel, level)) return true;
		}
		return false;
	}
	fmtMessage(level, msg, args = []) {
		if (msg instanceof Error) {
			msg = errToStr(msg);
		}
		if (typeof msg === 'object') {
			args.shift(msg);
			msg = '%2j';
		}
		args = args.map(e => (e instanceof Error ? errToStr(e) : e));
		if (typeof msg === 'string') {
			try {
				msg = vsprintf(msg, args);
			} catch (error) {
				this.error(error);
				this.error(`could not format msg ${msg}`);
			}
		}
		return `${this.processName} ${this.name} ${level}: ${msg}`;
	}

	isFiltered(level, msg = '') {
		return this.filter(level, msg);
	}

	sentryLog(level, originalMsg, data, message) {
		addBreadcrumb({
			level,
			message,
			data,
			category: `${this.processName}:${this.name}`
		});
		if (originalMsg instanceof Error) {
			captureException(originalMsg);
		}
	}

	log(level, msg, ...args) {
		if (process.env.MODE === 'test' && !Logger.TEST) return;
		if (!this.checkLevels(level)) return;
		let formattedMsg = this.fmtMessage(level, msg, args);
		if (this.isFiltered(level, formattedMsg)) return;
		this.sentryLog(level, msg, args, formattedMsg);
		if (level === 'trace') level = 'silly';
		elog[level](formattedMsg);
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
