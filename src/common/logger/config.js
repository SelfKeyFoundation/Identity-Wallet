import { createFilter } from './utils';
import is from 'electron-is';
import log from 'electron-log';

export const loggerConfig = {};

export const updateGlobalConfig = conf => {
	if (conf) Object.assign(loggerConfig, conf);
	configureElectronLog(loggerConfig);
};

export const configureElectronLog = conf => {
	conf = {
		...conf,
		logLevelConsole: conf.logLevelConsole === 'trace' ? 'silly' : conf.logLevelConsole,
		logLevelFile: conf.logLevelFile === 'trace' ? 'silly' : conf.logLevelFile
	};
	log.transports.console.level = conf.logLevelConsole;
	log.transports.console.format = conf.fmtTpl;

	log.transports.file.level = conf.logLevelFile;
	log.transports.file.format = conf.fmtTpl;
};

export const init = conf => {
	loggerConfig.processPrefix = is.main() ? 'MAIN' : 'RENDERER';
	loggerConfig.logLevelDefault = process.env.NODE_ENV === 'development' ? 'info' : 'warn';
	loggerConfig.logLevel = process.env.LOG_LEVEL || loggerConfig.logLevelDefault;
	loggerConfig.logLevelConsole = process.env.LOG_LEVEL_CONSOLE || loggerConfig.logLevel;
	loggerConfig.logLevelFile = process.env.LOG_LEVEL_FILE || loggerConfig.logLevel;
	loggerConfig.filters = process.env.LOG_FILTER || null;
	loggerConfig.filterLevels = process.env.LOG_FILTER_LEVELS || null;
	loggerConfig.filterFn = createFilter(loggerConfig);
	loggerConfig.prefix = 'general';
	loggerConfig.fmtTpl = '{y}-{m}-{d} {h}:{i}:{s}:{ms} {text}';
	if (conf) {
		Object.assign(loggerConfig, conf);
	}
	if (is.main()) configureElectronLog(loggerConfig);
	return conf;
};

export default loggerConfig;
