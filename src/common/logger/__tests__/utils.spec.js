import * as utils from '../utils';

describe('log utils', () => {
	describe('compareLevels', () => {
		const t = (pass, check, expected) =>
			it(`pass:${pass}, check:${check} -> ${expected}`, () => {
				expect(utils.compareLevels(pass, check)).toBe(expected);
			});
		t('error', 'warn', false);
		t('error', 'info', false);
		t('error', 'verbose', false);
		t('error', 'debug', false);
		t('error', 'trace', false);
		t('error', 'silly', false);
		t('error', 'NOT_EXISTS', false);
		t('error', 'error', true);

		t('warn', 'warn', true);
		t('warn', 'info', false);
		t('warn', 'verbose', false);
		t('warn', 'debug', false);
		t('warn', 'trace', false);
		t('warn', 'silly', false);
		t('warn', 'NOT_EXISTS', false);
		t('warn', 'error', true);

		t('info', 'warn', true);
		t('info', 'info', true);
		t('info', 'verbose', false);
		t('info', 'debug', false);
		t('info', 'trace', false);
		t('info', 'silly', false);
		t('info', 'NOT_EXISTS', false);
		t('info', 'error', true);

		t('verbose', 'warn', true);
		t('verbose', 'info', true);
		t('verbose', 'verbose', true);
		t('verbose', 'debug', false);
		t('verbose', 'trace', false);
		t('verbose', 'silly', false);
		t('verbose', 'NOT_EXISTS', false);
		t('verbose', 'error', true);

		t('debug', 'warn', true);
		t('debug', 'info', true);
		t('debug', 'verbose', true);
		t('debug', 'debug', true);
		t('debug', 'trace', false);
		t('debug', 'silly', false);
		t('debug', 'NOT_EXISTS', false);
		t('debug', 'error', true);

		t('trace', 'warn', true);
		t('trace', 'info', true);
		t('trace', 'verbose', true);
		t('trace', 'debug', true);
		t('trace', 'trace', true);
		t('trace', 'silly', false);
		t('trace', 'NOT_EXISTS', false);
		t('trace', 'error', true);
	});

	xdescribe('createFilter', () => {});

	xdescribe('errToStr', () => {});
});
