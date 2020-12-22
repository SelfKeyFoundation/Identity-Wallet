import sinon from 'sinon';
import rp from 'request-promise-native';
import { ParameterValidationError } from 'parameter-validator';
import Api from './api';

jest.mock('request-promise-native');
describe('Api', () => {
	const opt = { endpoint: 'http://test.com/' };

	afterEach(() => {
		rp.mockRestore();
		sinon.restore();
	});
	describe('constructor', () => {
		it('should construct if all parameters are correct', () => {
			const api = new Api(opt);

			expect(api.opt).toEqual(expect.objectContaining(opt));
		});

		it('should keep onRequestError callback in opt', () => {
			const onRequestError = () => {};
			const api = new Api({ ...opt, onRequestError });

			expect(api.opt).toEqual(expect.objectContaining({ onRequestError }));
		});

		it('should throw parameter error if no opts', () => {
			try {
				// eslint-disable-next-line no-new
				new Api(null);
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});
		it('should throw parameter error if no endpoint', () => {
			try {
				// eslint-disable-next-line no-new
				new Api({});
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});
	});

	describe('setHeader', () => {
		it('should set header to opt', () => {
			const api = new Api(opt);

			api.setHeader('test', 'test-value');
			expect(api.opt.headers).toEqual(
				expect.objectContaining({
					test: 'test-value'
				})
			);
		});
	});
	describe('request', () => {
		let api;

		beforeEach(() => {
			api = new Api(opt);
		});

		it('should throw parameter error if no opt', async () => {
			try {
				await api.request();
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});

		it('should throw parameter error if no url', async () => {
			try {
				await api.request({ method: 'GET' });
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});
		it('should throw parameter error if no method', async () => {
			try {
				await api.request({ url: '/hi' });
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});

		it('should call request with joined url', async () => {
			await api.request({ url: '/hi', method: 'get' });
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					url: `${opt.endpoint}hi`
				})
			);
		});

		it('should call request with uppercase method', async () => {
			await api.request({ url: '/hi', method: 'get' });
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET'
				})
			);
		});

		it('should call request with json option', async () => {
			await api.request({ url: '/hi', method: 'get' });
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					json: true
				})
			);
		});

		it('should call request empty headers if not defined', async () => {
			await api.request({ url: '/hi', method: 'get' });
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: {}
				})
			);
		});

		it('should call request with headers if  defined', async () => {
			const headers = { 'Accept-Encoding': 'text/html' };
			await api.request({ url: '/hi', method: 'get', headers });
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					headers
				})
			);
		});

		it('should call request with merged default headers', async () => {
			api.opt.headers = { test: 'test', test3: 'yo' };
			await api.request({
				url: '/hi',
				method: 'get',
				headers: { test2: 'hi', test3: 'override' }
			});
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: {
						test: 'test',
						test2: 'hi',
						test3: 'override'
					}
				})
			);
		});

		it('should call request with qs if  defined', async () => {
			const qs = { token: 'hi' };
			await api.request({ url: '/hi', method: 'get', qs });
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					qs
				})
			);
		});

		it('should call request with empty qs if not defined', async () => {
			await api.request({ url: '/hi', method: 'get' });
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					qs: {}
				})
			);
		});

		it('should call request with merged default qs', async () => {
			api.opt.qs = { test: 'test', test3: 'yo' };
			await api.request({
				url: '/hi',
				method: 'get',
				qs: { test2: 'hi', test3: 'override' }
			});
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					qs: {
						test: 'test',
						test2: 'hi',
						test3: 'override'
					}
				})
			);
		});

		it('should call request with body if defined', async () => {
			const body = { test: 'hi' };
			await api.request({ url: '/hi', method: 'get', body });
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					body
				})
			);
		});

		it('should call request with body if defined', async () => {
			const body = { test: 'hi' };
			await api.request({ url: '/hi', method: 'get', body });
			expect(rp).toHaveBeenCalledWith(
				expect.objectContaining({
					body
				})
			);
		});

		it('should call onRequestError if error is thrown on request', async () => {
			const error = new Error('Request Error');
			const returnedResp = 'response';
			error.statusCode = 401;
			rp.mockImplementation(async () => {
				throw error;
			});
			api.opt.onRequestError = cachedError => {
				expect(cachedError).toEqual(error);
				return returnedResp;
			};

			const resp = await api.request({ url: '/hi', method: 'get' });
			expect(resp).toEqual(returnedResp);
		});
		it('should not call onRequestError if error is thrown not on request', async () => {
			const thrownError = new Error('Request Error');
			rp.mockImplementation(async () => {
				throw thrownError;
			});
			api.opt.onRequestError = cachedError => {
				expect(cachedError).toEqual(thrownError);
			};
			try {
				await api.request({ url: '/hi', method: 'get' });
			} catch (error) {
				expect(error).toEqual(thrownError);
			}
		});
	});
});
