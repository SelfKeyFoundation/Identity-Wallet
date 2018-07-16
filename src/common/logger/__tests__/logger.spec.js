import Logger from '../logger';
import globalConfig, { init as initConfig } from '../config';
import elog from 'electron-log';
import sinon from 'sinon';

describe('Logger', () => {
	let logger;
	beforeAll(() => {
		initConfig();
	});
	beforeEach(() => {
		logger = new Logger('test');
	});
	afterEach(() => {
		initConfig();
	});
	it('get globalConfig', () => {
		expect(logger.globalConfig).toBe(globalConfig);
	});
	it('set globalConfig', () => {
		logger.globalConfig = { test: 1 };
		expect(globalConfig.test).toBe(1);
		let logger2 = new Logger('logger2');
		expect(logger2.globalConfig.test).toBe(1);
	});
	it('overrideGlobalLogLevel', () => {
		const originalConsoleLevel = logger.globalConfig.logLevelConsole;
		const originalFileLevel = logger.globalConfig.logLevelFile;
		expect(originalConsoleLevel).not.toBe('trace');
		expect(originalFileLevel).not.toBe('trace');
		logger.overrideGlobalLogLevel('trace');
		expect(logger.globalConfig.logLevelConsole).toBe('trace');
		expect(logger.globalConfig.logLevelFile).toBe('trace');
		logger.overrideGlobalLogLevel(false);
		expect(logger.globalConfig.logLevelConsole).toBe(originalConsoleLevel);
		expect(logger.globalConfig.logLevelFile).toBe(originalFileLevel);
	});
	xdescribe('checkLevels', () => {});
	describe('log', () => {
		beforeEach(() => {
			initConfig({
				logLevelConsole: 'trace',
				logLevelFile: 'trace'
			});
			sinon.stub(logger, 'fmtMessage');
		});
		afterEach(() => {
			logger.fmtMessage.restore();
		});
		const t = (level, logLevel) =>
			it(level, () => {
				logLevel = logLevel || level;
				sinon.stub(elog, logLevel);
				logger[level]('test');
				expect(elog[logLevel].calledOnce).toBe(true);
				expect(logger.fmtMessage.calledOnce).toBe(true);
				elog[logLevel].restore();
			});
		t('info');
		t('warn');
		t('info');
		t('error');
		t('verbose');
		t('debug');
		t('trace', 'silly');
	});
});
