import sinon from 'sinon';
import { ParameterValidationError } from 'parameter-validator';
import MoonPayApi from './moonpay-api';
import _ from 'lodash';
import Api from '../common/api';

const ENDPOINT = 'http://test.com';
const API_KEY = 'test-key';
describe('MoonPayApi', () => {
	const identity = {
		genSignatureForMessage() {}
	};
	const opt = { endpoint: ENDPOINT, apiKey: API_KEY };

	afterEach(() => {
		sinon.restore();
	});

	describe('constructor', () => {
		it('should construct if all parameters are correct', () => {
			const mpApi = new MoonPayApi(identity, opt);

			expect(mpApi.identity).toEqual(identity);
			expect(mpApi.opt).toEqual(opt);
			expect(mpApi.api).toBeInstanceOf(Api);
			expect(mpApi.api.opt).toEqual(
				expect.objectContaining({
					endpoint: ENDPOINT,
					qs: { apiKey: API_KEY }
				})
			);
		});

		it('should throw parameter error if no identity', () => {
			try {
				// eslint-disable-next-line no-new
				new MoonPayApi(null, opt);
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});

		it('should throw parameter error if no opts', () => {
			try {
				// eslint-disable-next-line no-new
				new MoonPayApi(identity, null);
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});
		it('should throw parameter error if no endpoint', () => {
			try {
				// eslint-disable-next-line no-new
				new MoonPayApi(identity, _.omit(opt, ['endpoint']));
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});

		it('should throw parameter error if no apiKey', () => {
			try {
				// eslint-disable-next-line no-new
				new MoonPayApi(identity, _.omit(opt, ['apiKey']));
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});
	});

	describe('setLoginInfo', () => {
		let mpApi;

		beforeEach(() => {
			mpApi = new MoonPayApi(identity, opt);
		});

		it('should set login info', () => {
			const setHeader = sinon.stub(mpApi.api, 'setHeader');
			const loginInfo = { token: '123', customer: { id: 123 } };
			expect(mpApi.loginInfo).toBeNull();
			mpApi.setLoginInfo(loginInfo);
			expect(mpApi.loginInfo).toEqual(loginInfo);
			expect(setHeader.getCall(0).args).toEqual(['Authorization', `Bearer 123`]);
		});

		it('should unset login info', () => {
			const setHeader = sinon.stub(mpApi.api, 'setHeader');
			mpApi.loginInfo = { token: 123 };
			mpApi.setLoginInfo(null);
			expect(mpApi.loginInfo).toBeNull();
			expect(setHeader.getCall(0).args).toEqual(['Authorization', null]);
		});

		it('should throw if no token in login info', () => {
			const loginInfo = { customer: { id: 123 } };
			expect(() => mpApi.setLoginInfo(loginInfo)).toThrowError(ParameterValidationError);
		});

		it('should throw if no customer in login info', () => {
			const loginInfo = { token: 123 };
			expect(() => mpApi.setLoginInfo(loginInfo)).toThrowError(ParameterValidationError);
		});
	});

	describe('getLoginInfo', () => {
		let mpApi;

		beforeEach(() => {
			mpApi = new MoonPayApi(identity, opt);
		});
		it('should return login info', () => {
			expect(mpApi.getLoginInfo()).toBeNull();
			mpApi.loginInfo = 'test';
			expect(mpApi.getLoginInfo()).toBe('test');
		});
	});

	describe('isLoggedIn', () => {
		let mpApi;

		beforeEach(() => {
			mpApi = new MoonPayApi(identity, opt);
		});
		it('should true if logged in', () => {
			mpApi.loginInfo = 'test';
			expect(mpApi.isLoggedIn()).toBe(true);
		});
		it('should false if not logged in', () => {
			mpApi.loginInfo = null;
			expect(mpApi.isLoggedIn()).toBe(false);
		});
	});

	describe('requests', () => {
		let mpApi;

		beforeEach(() => {
			mpApi = new MoonPayApi(identity, opt);
		});

		describe('handleRequestError', () => {
			it('should reset login info on 401', () => {
				const thrownError = new Error('401 error');
				thrownError.statusCode = 401;
				const setLogin = sinon.stub(mpApi, 'setLoginInfo');

				try {
					mpApi.handleRequestError(thrownError);
					fail('error was not thrown');
				} catch (error) {
					expect(thrownError).toEqual(error);
					expect(setLogin.getCall(0).args[0]).toBe(null);
				}
			});
			it('should should pass through non 401', () => {
				const thrownError = new Error('non 401 error');
				const setLogin = sinon.stub(mpApi, 'setLoginInfo');
				thrownError.statusCode = 404;
				try {
					mpApi.handleRequestError(thrownError);
					fail('error was not thrown');
				} catch (error) {
					expect(thrownError).toEqual(error);
					expect(setLogin.getCall(0)).toBeNull();
				}
			});
		});
		describe('getChallenge', () => {
			const EMAIL = 'test@email.com';
			const ADDRESS = '0xdasdsadsadsadsaada';
			const NONCE = '1234';

			const data = {
				email: EMAIL,
				walletAddress: ADDRESS
			};

			it('should call api', async () => {
				const rq = sinon.stub(mpApi.api, 'request').resolves({ nonce: NONCE });

				await mpApi.getChallenge(data);

				expect(rq.getCall(0).args[0]).toEqual({
					method: 'post',
					url: '/customers/wallet_address_login',
					body: data
				});
			});
			it('should resolve nonce', async () => {
				sinon.stub(mpApi.api, 'request').resolves({ nonce: NONCE });

				const resp = await mpApi.getChallenge(data);

				expect(resp).toEqual(NONCE);
			});

			it('should throw if no email', async () => {
				sinon.stub(mpApi.api, 'request').resolves();
				try {
					await mpApi.getChallenge(_.omit(data, ['email']));
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw if no walletAddress', async () => {
				sinon.stub(mpApi.api, 'request').resolves();
				try {
					await mpApi.getChallenge(_.omit(data, ['walletAddress']));
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
		});

		describe('postChallenge', () => {
			const EMAIL = 'test@email.com';
			const ADDRESS = '0xdasdsadsadsadsaada';
			const SIGNATURE = '0xasdasdadsdsadasd';
			const TOKEN = 'asdaddasdasd';
			const CUSTOMER_ID = '131231';

			const data = {
				email: EMAIL,
				walletAddress: ADDRESS,
				signature: SIGNATURE
			};

			const response = {
				token: TOKEN,
				customer: {
					id: CUSTOMER_ID
				}
			};

			it('should call api', async () => {
				const rq = sinon.stub(mpApi.api, 'request').resolves(response);

				await mpApi.postChallenge(data);

				expect(rq.getCall(0).args[0]).toEqual({
					method: 'post',
					url: '/customers/wallet_address_login',
					body: data
				});
			});
			it('should resolve login data', async () => {
				sinon.stub(mpApi.api, 'request').resolves(response);

				const resp = await mpApi.postChallenge(data);

				expect(resp).toEqual(response);
			});

			it('should throw if no email', async () => {
				sinon.stub(mpApi.api, 'request').resolves();
				try {
					await mpApi.postChallenge(_.omit(data, ['email']));
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw if no walletAddress', async () => {
				sinon.stub(mpApi.api, 'request').resolves();
				try {
					await mpApi.postChallenge(_.omit(data, ['walletAddress']));
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw if no signature', async () => {
				sinon.stub(mpApi.api, 'request').resolves();
				try {
					await mpApi.postChallenge(_.omit(data, ['signature']));
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
		});

		describe('establishSession', () => {
			const EMAIL = 'test@email.com';
			const ADDRESS = '0xdasdsadsadsadsaada';
			const SIGNATURE = '0xasdasdadsdsadasd';
			const NONCE = '515151';
			const TOKEN = 'asdaddasdasd';
			const CUSTOMER_ID = '131231';

			const data = {
				email: EMAIL,
				walletAddress: ADDRESS
			};

			const response = {
				token: TOKEN,
				customer: {
					id: CUSTOMER_ID
				}
			};

			it('should resolve login info', async () => {
				const c = sinon.stub(mpApi, 'getChallenge').resolves(NONCE);
				const pc = sinon.stub(mpApi, 'postChallenge').resolves(response);
				const id = sinon.stub(identity, 'genSignatureForMessage').resolves(SIGNATURE);
				const setLogin = sinon.stub(mpApi, 'setLoginInfo');

				const resp = await mpApi.establishSession(data);

				expect(c.getCall(0).args[0]).toEqual(data);
				expect(id.getCall(0).args[0]).toEqual(NONCE);
				expect(pc.getCall(0).args[0]).toEqual({ ...data, signature: SIGNATURE });

				expect(resp).toEqual(response);
				expect(setLogin.getCall(0).args[0]).toEqual(response);
			});

			it('should throw if no email', async () => {
				sinon.stub(mpApi.api, 'request').resolves();
				try {
					await mpApi.postChallenge(_.omit(data, ['email']));
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw if no walletAddress', async () => {
				sinon.stub(mpApi.api, 'request').resolves();
				try {
					await mpApi.postChallenge(_.omit(data, ['walletAddress']));
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
		});

		describe('getCustomer', () => {
			const customer = {
				id: '7138fb07-7c66-4f9a-a83a-a106e66bfde6',
				createdAt: '2018-08-24T08:39:30.540Z',
				updatedAt: '2018-08-24T08:39:30.893Z',
				firstName: null,
				lastName: null,
				email: 'john.doe@moonpay.com',
				phoneNumber: null,
				isPhoneNumberVerified: false,
				dateOfBirth: null,
				liveMode: false,
				defaultCurrencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
				address: {
					street: null,
					subStreet: null,
					town: null,
					postCode: null,
					state: null,
					country: null
				},
				externalCustomerId: '41e794f0-b9ee-48cd-842a-431edf6555b8'
			};
			it('should resolve customer', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(customer);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.getCustomer();
				expect(resp).toEqual(customer);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'customers/me'
				});
			});
			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(customer);
				sinon.stub(mpApi, 'setLoginInfo');
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.getCustomer();
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
		});
		describe('refreshToken', () => {
			const TOKEN = 'asdaddasdasd';
			const expectedResponse = {
				csrfToken: 'tefdsfsdfs',
				customer: {
					id: '7138fb07-7c66-4f9a-a83a-a106e66bfde6',
					createdAt: '2018-08-24T08:39:30.540Z',
					updatedAt: '2018-08-24T08:39:30.540Z',
					firstName: null,
					lastName: null,
					email: 'john.doe@moonpay.com',
					phoneNumber: null,
					isPhoneNumberVerified: false,
					dateOfBirth: null,
					liveMode: false,
					defaultCurrencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
					address: {
						street: null,
						subStreet: null,
						town: null,
						postCode: null,
						state: null,
						country: null
					},
					externalCustomerId: '41e794f0-b9ee-48cd-842a-431edf6555b8'
				},
				token: TOKEN
			};
			it('should resolve refresh token', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				const setLogin = sinon.stub(mpApi, 'setLoginInfo');
				sinon.stub(mpApi, 'isLoggedIn').returns(true);

				const resp = await mpApi.refreshToken();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'customers/refresh_token'
				});
				expect(setLogin.getCall(0).args[0]).toEqual(expectedResponse);
			});

			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'setLoginInfo');
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.refreshToken();
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
		});
	});
});
