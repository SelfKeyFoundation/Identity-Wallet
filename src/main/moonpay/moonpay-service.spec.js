import sinon from 'sinon';
import MoonPayService from './moonpay-service';
import { ParameterValidationError } from 'parameter-validator';

describe('MoonPayService', () => {
	const config = {
		moonPayApiEndpoint: 'http://test-moonpay.com/v3',
		moonPayApiKey: 'asdsadasdasdas'
	};

	let service;

	beforeEach(() => {
		service = new MoonPayService({ config });
	});

	afterEach(() => {
		sinon.restore();
	});

	describe('constructor', () => {
		it('should init properties', () => {
			expect(service.endpoint).toEqual(config.moonPayApiEndpoint);
			expect(service.apiKey).toEqual(config.moonPayApiKey);
			expect(service.config).toEqual(config);
		});
	});
	describe('getApi', () => {
		it('should create unauthenticated api', () => {
			const api = service.getApi();

			expect(api.isLoggedIn()).toBe(false);
			expect(api.opt).toEqual(
				expect.objectContaining({
					endpoint: config.moonPayApiEndpoint,
					apiKey: config.moonPayApiKey
				})
			);
		});

		it('should create authenticated api', () => {
			const api = service.getApi({
				token: 'hello',
				customer: { id: '12312331' }
			});

			expect(api.isLoggedIn()).toBe(true);
			expect(api.opt).toEqual(
				expect.objectContaining({
					endpoint: config.moonPayApiEndpoint,
					apiKey: config.moonPayApiKey
				})
			);
		});
	});

	describe('authenticate', () => {
		const authData = {
			email: 'test@test.com',
			walletAddress: '0xfgasdasdasfasdasdas'
		};

		const identity = {
			address: authData.walletAddress,
			genSignatureForMessage: sinon.stub()
		};

		let api;

		beforeEach(() => {
			api = service.getApi();
			sinon.stub(service, 'getApi').returns(api);
		});

		it('should throw parameter validation error if identity is not provided', async () => {
			try {
				await service.auth(undefined, authData.email);
				fail('did not throw error');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});

		it('should throw parameter validation error if email is not provided', async () => {
			try {
				await service.auth(identity);
				fail('did not throw error');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});

		it('should create session', async () => {
			const session = sinon.stub(api, 'establishSession');

			await service.auth(identity, authData.email);

			expect(session.getCall(0).args[0]).toEqual(authData);
			expect(typeof session.getCall(0).args[1]).toBe('function');
		});
	});

	describe('authenticated requests', () => {
		const auth = { token: 'sdasdasdsad', customer: { id: 'sdasdasdsda' } };
		let api;

		beforeEach(() => {
			api = service.getApi(auth);
			sinon.stub(service, 'getApi').returns(api);
		});
		describe('getLimits', () => {
			it('should return limits', async () => {
				const expected = { limits: 'test' };
				const l = sinon.stub(api, 'getLimits').resolves(expected);
				const res = await service.getLimits(auth);
				expect(res).toEqual(expected);
				expect(service.getApi.getCall(0).args[0]).toEqual(auth);
				expect(l.called).toBe(true);
			});
		});
	});
});
