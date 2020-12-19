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

		describe('updateCustomer', () => {
			const customer = {
				id: '7138fb07-7c66-4f9a-a83a-a106e66bfde6',
				createdAt: '2018-08-24T08:39:30.540Z',
				updatedAt: '2018-08-24T08:40:18.873Z',
				firstName: 'John',
				lastName: 'Doe',
				email: 'john.doe@moonpay.com',
				phoneNumber: '+15417543010',
				isPhoneNumberVerified: false,
				dateOfBirth: '1980-01-01T00:00:00.000Z',
				liveMode: false,
				defaultCurrencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
				address: {
					street: '123 Mission St',
					subStreet: null,
					town: 'San Francisco',
					postCode: '94105',
					state: 'CA',
					country: 'USA'
				},
				externalCustomerId: '41e794f0-b9ee-48cd-842a-431edf6555b8'
			};
			it('should update customer', async () => {
				const rp = sinon
					.stub(mpApi.api, 'request')
					.resolves({ ...customer, firstName: 'testName' });
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.updateCustomer({
					firstName: 'testName',
					extraField: 'testExtraField',
					address: {
						street: '123 Mission St',
						testExtraAddress: 'test'
					}
				});
				expect(resp).toEqual({ ...customer, firstName: 'testName' });
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'patch',
					url: 'customers/me',
					body: {
						firstName: 'testName',
						address: {
							street: '123 Mission St'
						}
					}
				});
			});
			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(customer);
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.updateCustomer({ customer });
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
		});
		describe('verifyPhone', () => {
			const expectedResponse = {
				success: true
			};

			const payload = {
				verificationCode: '234142'
			};
			it('should verify phone', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.verifyPhone({
					...payload,
					testExtraParam: 'test'
				});
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'post',
					url: 'customers/verify_phone_number',
					body: payload
				});
			});
			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.verifyPhone();
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});

			it('should throw parameter error if no verificationCode', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

					await mpApi.verifyPhone({});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
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
		describe('getAccount', () => {
			const expectedResponse = {
				id: '08f6bf60-4fb0-4cc0-a9cb-938cc5fd7223',
				createdAt: '2020-03-18T10:45:34.887Z',
				updatedAt: '2020-03-18T10:45:34.887Z',
				name: 'MoonPay Test',
				isVerified: true,
				cardFeePercentage: 4.5,
				sepaFeePercentage: 1,
				cardExtraFeePercentage: 1,
				sepaExtraFeePercentage: 0.5,
				bankTransferMinimumFee: {
					EUR: 4.99,
					GBP: 4.99
				},
				cardMinimumFee: {
					USD: 4.99,
					GBP: 4.99,
					EUR: 4.99,
					CAD: 7.93,
					AUD: 9.23,
					ZAR: 100.88
				}
			};
			it('should resolve account', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

				const resp = await mpApi.getAccount();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'accounts/me'
				});
			});
		});

		describe('listCurrencies', () => {
			const expectedResponse = [
				{
					id: 'a18a8d0b-502c-48b9-ab6b-e2638fba5862',
					createdAt: '2018-09-28T10:47:49.801Z',
					updatedAt: '2018-09-28T10:47:49.801Z',
					type: 'crypto',
					name: 'Bitcoin',
					code: 'btc',
					precision: 5,
					addressRegex: '^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$',
					testnetAddressRegex: '^(tb1|[2mn])[a-zA-HJ-NP-Z0-9]{25,39}$',
					supportsAddressTag: false,
					addressTagRegex: null,
					supportsTestMode: true,
					isSuspended: false,
					isSupportedInUS: true,
					isSellSupported: false,
					notAllowedUSStates: ['CT', 'NY']
				},
				{
					id: '8d305f63-1fd7-4e01-a220-8445e591aec4',
					createdAt: '2018-09-28T10:47:49.801Z',
					updatedAt: '2018-09-28T10:47:49.801Z',
					type: 'crypto',
					name: 'Ethereum',
					code: 'eth',
					precision: 5,
					addressRegex: '^(0x)?[0-9a-fA-F]{40}$',
					testnetAddressRegex: '^(0x)?[0-9a-fA-F]{40}$',
					supportsAddressTag: false,
					addressTagRegex: null,
					supportsTestMode: true,
					isSuspended: false,
					isSupportedInUS: true,
					isSellSupported: false,
					notAllowedUSStates: ['CT', 'NY']
				},
				{
					id: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
					createdAt: '2019-04-22T15:12:07.861Z',
					updatedAt: '2019-04-22T15:12:07.861Z',
					type: 'fiat',
					name: 'Euro',
					minAmount: 20,
					maxAmount: 2000,
					code: 'eur',
					precision: 2
				},
				{
					id: 'c8b1ef20-3703-4a66-9ea1-c13ce0d893bf',
					createdAt: '2019-04-10T15:58:46.394Z',
					updatedAt: '2019-04-22T21:40:15.662Z',
					type: 'crypto',
					name: 'Stellar',
					code: 'xlm',
					precision: 1,
					addressRegex: '^G[A-Z0-9]{55}$',
					testnetAddressRegex: '^G[A-Z0-9]{55}$',
					supportsAddressTag: true,
					addressTagRegex: '^.*$',
					supportsTestMode: false,
					isSuspended: false,
					isSupportedInUS: true,
					isSellSupported: false,
					notAllowedUSStates: ['CT', 'NY']
				}
			];
			it('should resolve currencies', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

				const resp = await mpApi.listCurrencies();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'currencies'
				});
			});
		});

		describe('getCurrencyPrice', () => {
			const expectedResponse = {
				EUR: 4819.93757,
				GBP: 4147.80961,
				USD: 5355.0604
			};

			const currencyCode = 'btc';
			it('should resolve currencies', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

				const resp = await mpApi.getCurrencyPrice({ currencyCode });
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: `currencies/${currencyCode}/price`
				});
			});

			it('should throw parameter error if no currencyCode', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

					await mpApi.listCurrencyPrices({});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
		});
		describe('listCurrencyPrices', () => {
			const expectedResponse = {
				BCH: {
					EUR: 431.27125,
					GBP: 380.22438
				},
				BTC: {
					EUR: 8064.79002,
					GBP: 7110.21139
				}
			};

			const cryptoCurrencies = ['bhc', 'BTC'];
			const fiatCurrencies = ['eur', 'GBP'];
			it('should resolve currencies', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

				const resp = await mpApi.listCurrencyPrices({ cryptoCurrencies, fiatCurrencies });
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: `currencies/price`,
					qs: {
						cryptoCurrencies: 'bhc,btc',
						fiatCurrencies: 'eur,gbp'
					}
				});
			});

			it('should throw parameter error if no cryptoCurrencies', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

					await mpApi.listCurrencyPrices({
						fiatCurrencies
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if no cryptoCurrencies', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

					await mpApi.listCurrencyPrices({
						cryptoCurrencies
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
		});
		describe('getQuote', () => {
			const expectedResponse1 = {
				baseCurrency: {
					id: 'edd81f1f-f735-4692-b410-6def107f17d2',
					createdAt: '2019-04-29T16:55:28.647Z',
					updatedAt: '2019-04-29T16:55:28.647Z',
					type: 'fiat',
					name: 'US Dollar',
					code: 'usd',
					precision: 2
				},
				baseCurrencyAmount: 50,
				currency: {
					id: 'a18a8d0b-502c-48b9-ab6b-e2638fba5862',
					createdAt: '2018-09-28T10:47:49.801Z',
					updatedAt: '2018-09-28T10:47:49.801Z',
					type: 'crypto',
					name: 'Bitcoin',
					code: 'btc',
					precision: 5,
					addressRegex: '^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$',
					testnetAddressRegex: '^(tb1|[2mn])[a-zA-HJ-NP-Z0-9]{25,39}$',
					supportsAddressTag: false,
					addressTagRegex: null,
					supportsTestMode: true,
					isSuspended: false,
					isSupportedInUS: true,
					isSellSupported: false,
					notAllowedUSStates: ['CT', 'NY']
				},
				extraFeeAmount: 2.5,
				networkFeeAmount: 0,
				feeAmount: 4.99,
				paymentMethod: 'credit_debit_card',
				quoteCurrencyAmount: 0.00558,
				totalAmount: 57.49
			};
			const expectedResponse2 = {
				baseCurrency: {
					id: 'edd81f1f-f735-4692-b410-6def107f17d2',
					createdAt: '2019-04-29T16:55:28.647Z',
					updatedAt: '2019-04-29T16:55:28.647Z',
					type: 'fiat',
					name: 'US Dollar',
					code: 'usd',
					precision: 2
				},
				baseCurrencyAmount: 50,
				currency: {
					id: 'a18a8d0b-502c-48b9-ab6b-e2638fba5862',
					createdAt: '2018-09-28T10:47:49.801Z',
					updatedAt: '2018-09-28T10:47:49.801Z',
					type: 'crypto',
					name: 'Bitcoin',
					code: 'btc',
					precision: 5,
					addressRegex: '^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$',
					testnetAddressRegex: '^(tb1|[2mn])[a-zA-HJ-NP-Z0-9]{25,39}$',
					supportsAddressTag: false,
					addressTagRegex: null,
					supportsTestMode: true,
					isSuspended: false,
					isSupportedInUS: true,
					isSellSupported: false,
					notAllowedUSStates: ['CT', 'NY']
				},
				extraFeeAmount: 2.5,
				networkFeeAmount: 0,
				feeAmount: 4.99,
				paymentMethod: 'credit_debit_card',
				quoteCurrencyAmount: 0.00558,
				totalAmount: 57.49
			};

			const currencyCode = 'BTC';
			const baseCurrencyCode = 'USD';
			const baseCurrencyAmount = 50;
			const extraFeePercentage = 5;

			it('should resolve quote', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse1);
				const paymentMethod = 'Credit_debit_card';
				const resp = await mpApi.getQuote({
					currencyCode,
					baseCurrencyCode,
					baseCurrencyAmount,
					paymentMethod
				});
				expect(resp).toEqual(expectedResponse1);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: `currencies/btc/quote`,
					qs: {
						baseCurrencyCode: 'usd',
						baseCurrencyAmount,
						paymentMethod: 'credit_debit_card'
					}
				});
			});

			it('should resolve quote with fees', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse2);
				const paymentMethod = 'sepa_bank_transfer';
				const areFeesIncluded = true;
				const resp = await mpApi.getQuote({
					currencyCode,
					baseCurrencyCode,
					baseCurrencyAmount,
					extraFeePercentage,
					paymentMethod,
					areFeesIncluded
				});
				expect(resp).toEqual(expectedResponse2);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: `currencies/btc/quote`,
					qs: {
						baseCurrencyCode: 'usd',
						baseCurrencyAmount,
						extraFeePercentage,
						paymentMethod,
						areFeesIncluded: 'true'
					}
				});
			});

			it('should throw parameter error if no currencyCode', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse1);

					await mpApi.listCurrencyPrices({
						baseCurrencyCode,
						baseCurrencyAmount
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if no baseCurrencyCode', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse1);

					await mpApi.listCurrencyPrices({
						currencyCode,
						baseCurrencyAmount
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
			it('should throw parameter error if no baseCurrencyAmount', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse1);

					await mpApi.listCurrencyPrices({
						currencyCode,
						baseCurrencyCode
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if no payment method not supported', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse1);

					await mpApi.listCurrencyPrices({
						currencyCode,
						baseCurrencyCode,
						baseCurrencyAmount,
						paymentMethod: 'test'
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
		});
		describe('listCountries', () => {
			const expectedResponse = [
				{
					alpha2: 'AL',
					alpha3: 'ALB',
					isAllowed: false,
					name: 'Albania',
					supportedDocuments: ['passport', 'national_identity_card', 'driving_licence']
				},
				{
					alpha2: 'AD',
					alpha3: 'AND',
					isAllowed: false,
					name: 'Andorra',
					supportedDocuments: ['passport', 'driving_licence']
				}
			];
			it('should resolve countries', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

				const resp = await mpApi.listCountries();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'countries'
				});
			});
		});

		describe('getIpAddress', () => {
			const expectedResponse = {
				alpha2: 'GB',
				alpha3: 'GBR',
				state: 'ENG',
				ipAddress: '2a00:23c5:4b00:aa00:d513:f124:5797:c1c1',
				isAllowed: true
			};
			it('should resolve ipAddress info', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

				const resp = await mpApi.getIpAddress();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'ip_address'
				});
			});
		});

		describe('getLimits', () => {
			const expectedResponse = {
				limits: [
					{
						type: 'buy_credit_debit_card',
						dailyLimit: 2000,
						dailyLimitRemaining: 1000,
						monthlyLimit: 20000,
						monthlyLimitRemaining: 10000
					}
				],
				verificationLevels: [
					{
						name: 'Level 1',
						requirements: [
							{
								completed: true,
								identifier: 'identity_verification'
							},
							{
								completed: true,
								identifier: 'phone_number_verification'
							}
						],
						completed: true
					},
					{
						name: 'Level 2',
						requirements: [
							{
								completed: true,
								identifier: 'document_verification'
							},
							{
								completed: true,
								identifier: 'face_match_verification'
							}
						],
						completed: true
					}
				],
				limitIncreaseEligible: false
			};
			it('should resolve limits', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.getLimits();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'customers/me/limits'
				});
			});

			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.getLimits();
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
		});

		describe('_genS3SignedRequest', () => {
			const expectedResponse = {
				key: '1562247531050',
				signedRequest:
					'https://moonpay-documents.s3.amazonaws.com/1562247531050?AWSAccessKeyId=AKIAI6R5E66IE34WI77Q&Content-Type=image%2Fjpeg&Expires=1562247591&Signature=NJrKLp0fMLlcHj1NVocylodf6%2FE%3D&x-amz-server-side-encryption=AES256'
			};

			const fileType = 'image/jpeg';
			it('should resolve signed request', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				const resp = await mpApi._genS3SignedRequest({ fileType, testExtraProp: 'test' });
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'files/s3_signed_request',
					qs: { fileType }
				});
			});

			it('should throw parameter error if no fileType', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

					await mpApi._genS3SignedRequest({});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
		});

		describe('_uploadToS3', () => {
			const expectedResponse = {};
			const file = Buffer.from('test file');
			const signedRequest =
				'https://moonpay-documents.s3.amazonaws.com/1562247531050?AWSAccessKeyId=AKIAI6R5E66IE34WI77Q&Content-Type=image%2Fjpeg&Expires=1562247591&Signature=NJrKLp0fMLlcHj1NVocylodf6%2FE%3D&x-amz-server-side-encryption=AES256';
			it('should upload file to s3', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				const resp = await mpApi._uploadToS3({
					signedRequest,
					file,
					testExtraProp: 'test'
				});
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'put',
					url:
						'https://moonpay-documents.s3.amazonaws.com/1562247531050?AWSAccessKeyId=AKIAI6R5E66IE34WI77Q&Content-Type=image%2Fjpeg&Expires=1562247591&Signature=NJrKLp0fMLlcHj1NVocylodf6%2FE%3D&x-amz-server-side-encryption=AES256',
					formData: {
						document: {
							value: file
						}
					}
				});
			});

			it('should throw parameter error if no signedRequest', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

					await mpApi._uploadToS3({ file });
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if no file', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

					await mpApi._uploadToS3({ signedRequest });
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if file is not buffer', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);

					await mpApi._uploadToS3({ signedRequest, file: 'test file' });
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
		});

		describe('_createFile', () => {
			const expectedResponse = {
				id: 'c184b65d-ec32-43f7-9a00-cd502969eb51',
				createdAt: '2018-08-24T08:41:07.509Z',
				updatedAt: '2018-08-24T08:41:07.509Z',
				type: 'national_identity_card',
				side: 'front',
				country: 'GBR',
				customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
			};

			const key = '1562247531050';
			const type = 'national_identity_card';
			const side = 'front';
			const country = 'GBR';

			it('should create file', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi._createFile({
					key,
					type,
					country,
					side,
					testExtraParam: 'test'
				});
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'post',
					url: 'files',
					body: { key, type, country, side }
				});
			});

			it('should throw parameter error if no key', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi._createFile({
						type,
						country,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if no type', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi._createFile({
						key,
						country,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if type not supportedd', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi._createFile({
						key,
						type: 'not_supported',
						country,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if no country', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi._createFile({
						key,
						type,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if type national_identity_card and no side', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi._createFile({
						key,
						type: 'national_identity_card',
						country
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if type driving_licence and no side', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi._createFile({
						key,
						type: 'driving_licence',
						country
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if side is not front or back', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi._createFile({
						key,
						type,
						country,
						side: 'invalid_side'
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi._createFile({ key, type, country, side });
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
		});

		describe('uploadFile', () => {
			const expectedResponse = {
				id: 'c184b65d-ec32-43f7-9a00-cd502969eb51',
				createdAt: '2018-08-24T08:41:07.509Z',
				updatedAt: '2018-08-24T08:41:07.509Z',
				type: 'national_identity_card',
				side: 'front',
				country: 'GBR',
				customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
			};

			const signedRequestResp = {
				key: '1562247531050',
				signedRequest:
					'https://moonpay-documents.s3.amazonaws.com/1562247531050?AWSAccessKeyId=AKIAI6R5E66IE34WI77Q&Content-Type=image%2Fjpeg&Expires=1562247591&Signature=NJrKLp0fMLlcHj1NVocylodf6%2FE%3D&x-amz-server-side-encryption=AES256'
			};

			const file = Buffer.from('test file');
			const type = 'national_identity_card';
			const side = 'front';
			const country = 'GBR';
			const fileType = 'image/jpeg';

			it('should create file', async () => {
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const gen = sinon.stub(mpApi, '_genS3SignedRequest').resolves(signedRequestResp);
				const up = sinon.stub(mpApi, '_uploadToS3').resolves({});
				const create = sinon.stub(mpApi, '_createFile').resolves(expectedResponse);
				const resp = await mpApi.uploadFile({
					file,
					fileType,
					type,
					country,
					side
				});

				expect(resp).toEqual(expectedResponse);
				expect(gen.getCall(0).args[0]).toEqual({
					fileType
				});
				expect(up.getCall(0).args[0]).toEqual({
					file,
					signedRequest: signedRequestResp.signedRequest
				});
				expect(create.getCall(0).args[0]).toEqual({
					key: signedRequestResp.key,
					type,
					side,
					country
				});
			});

			it('should throw parameter error if no file', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.uploadFile({
						fileType,
						type,
						country,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if file is not buffer', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.uploadFile({
						file: 'test file',
						fileType,
						type,
						country,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if no fileType', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.uploadFile({
						file,
						type,
						country,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if no type', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.uploadFile({
						file,
						fileType,
						country,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if type not supportedd', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.uploadFile({
						file,
						fileType,
						type: 'not_supported',
						country,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if no country', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.uploadFile({
						file,
						fileType,
						type,
						side
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if type national_identity_card and no side', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.uploadFile({
						type: 'national_identity_card',
						file,
						fileType,
						country
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if type driving_licence and no side', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.uploadFile({
						type: 'driving_licence',
						file,
						fileType,
						country
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should throw parameter error if side is not front or back', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.uploadFile({
						file,
						fileType,
						type,
						country,
						side: 'invalid_side'
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.uploadFile({ file, fileType, type, country, side });
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
		});

		describe('listFiles', () => {
			const expectedResponse = [
				{
					id: 'c184b65d-ec32-43f7-9a00-cd502969eb51',
					createdAt: '2018-08-24T08:41:07.509Z',
					updatedAt: '2018-08-24T08:41:07.509Z',
					type: 'passport',
					side: null,
					country: 'GBR',
					customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
				},
				{
					id: '650970ac-cd51-43d2-b40f-fe999d21f2db',
					createdAt: '2018-08-24T08:41:45.162Z',
					updatedAt: '2018-08-24T08:41:45.162Z',
					type: 'selfie',
					side: null,
					country: 'GBR',
					customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
				}
			];

			it('should create file', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.listFiles();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'files'
				});
			});

			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.listFiles();
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
		});

		describe('createToken', () => {
			const expectedResponse = {
				id: 'fc33e149-1f18-4cc9-841e-0d28c13410bf',
				createdAt: '2018-08-24T08:43:32.013Z',
				updatedAt: '2018-08-24T08:43:32.013Z',
				expiresAt: '2018-08-24T09:43:32.013Z',
				expiryMonth: 12,
				expiryYear: 2020,
				brand: 'Visa',
				bin: '497600',
				lastDigits: '3436',
				billingAddress: {
					street: '123 Mission St',
					subStreet: null,
					town: 'San Francisco',
					postCode: '94105',
					state: 'CA',
					country: 'USA'
				}
			};
			const payload = {
				expiryDate: '22/2028',
				number: '12314151241241',
				cvc: '123',
				billingAddress: {
					street: '123 Mission St',
					subStreet: null,
					town: 'San Francisco',
					postCode: '94105',
					state: 'CA',
					country: 'USA'
				}
			};

			const t = (parameter, opt) =>
				it(`should return parameter error if no ${parameter}`, async () => {
					try {
						sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
						sinon.stub(mpApi, 'isLoggedIn').returns(true);
						opt = _.omit(opt, [parameter]);
						await mpApi.createToken(opt);
						fail('no error thrown');
					} catch (error) {
						expect(error).toBeInstanceOf(ParameterValidationError);
					}
				});
			it('should create token', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.createToken(payload);
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'post',
					url: 'tokens',
					body: payload
				});
			});

			it('should throw parameter error if country USA and no state', async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi.createToken({
						...payload,
						billingAddress: {
							..._.omit(payload.billingAddress, ['state']),
							country: 'USA'
						}
					});
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});
			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.createToken();
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
			[
				'expiryDate',
				'number',
				'cvc',
				'billingAddress',
				'billingAddress.street',
				'billingAddress.subStreet',
				'billingAddress.town',
				'billingAddress.postCode',
				'billingAddress.country'
			].map(p => t(p, payload));
		});

		describe('createCard', () => {
			const expectedResponse = {
				id: '68e46314-93e5-4420-ac10-485aef4e19d0',
				createdAt: '2018-08-24T08:43:32.013Z',
				updatedAt: '2018-08-24T08:43:32.013Z',
				expiryMonth: 12,
				expiryYear: 2020,
				brand: 'Visa',
				bin: '411111',
				lastDigits: '1111',
				billingAddress: {
					street: '123 Mission St',
					subStreet: null,
					town: 'San Francisco',
					postCode: '94105',
					state: 'CA',
					country: 'USA'
				},
				customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
			};
			const payload = {
				tokenId: 'fc33e149-1f18-4cc9-841e-0d28c13410bf'
			};

			const t = (parameter, opt) =>
				it(`should return parameter error if no ${parameter}`, async () => {
					try {
						sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
						sinon.stub(mpApi, 'isLoggedIn').returns(true);
						opt = _.omit(opt, [parameter]);
						await mpApi.createCard(opt);
						fail('no error thrown');
					} catch (error) {
						expect(error).toBeInstanceOf(ParameterValidationError);
					}
				});
			it('should create card', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.createCard(payload);
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'post',
					url: 'cards',
					body: payload
				});
			});

			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.createCard();
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
			['tokenId'].map(p => t(p, payload));
		});

		describe('listCards', () => {
			const expectedResponse = [
				{
					id: '68e46314-93e5-4420-ac10-485aef4e19d0',
					createdAt: '2018-08-24T08:43:32.013Z',
					updatedAt: '2018-08-24T08:43:32.013Z',
					expiryMonth: 12,
					expiryYear: 2020,
					brand: 'Visa',
					bin: '411111',
					lastDigits: '1111',
					billingAddress: {
						street: '123 Mission St',
						subStreet: null,
						town: 'San Francisco',
						postCode: '94105',
						state: 'CA',
						country: 'USA'
					},
					customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
				}
			];
			it('should resolve cards', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.listCards();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'cards'
				});
			});

			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.listCards();
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
		});
		describe('deleteCard', () => {
			const expectedResponse = {
				id: '68e46314-93e5-4420-ac10-485aef4e19d0',
				createdAt: '2018-08-24T08:43:32.013Z',
				updatedAt: '2018-08-24T08:43:32.013Z',
				expiryMonth: 12,
				expiryYear: 2020,
				brand: 'Visa',
				bin: '411111',
				lastDigits: '1111',
				billingAddress: {
					street: '123 Mission St',
					subStreet: null,
					town: 'San Francisco',
					postCode: '94105',
					state: 'CA',
					country: 'USA'
				},
				customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
			};
			const payload = { cardId: '68e46314-93e5-4420-ac10-485aef4e19d0' };

			const t = (parameter, opt) =>
				it(`should return parameter error if no ${parameter}`, async () => {
					try {
						sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
						sinon.stub(mpApi, 'isLoggedIn').returns(true);
						opt = _.omit(opt, [parameter]);
						await mpApi.deleteCard(opt);
						fail('no error thrown');
					} catch (error) {
						expect(error).toBeInstanceOf(ParameterValidationError);
					}
				});
			it('should create card', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.deleteCard(payload);
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'delete',
					url: `cards/${payload.cardId}`
				});
			});

			it('should reject if not logged in', async () => {
				sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi.deleteCard();
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
				}
			});
			['cardId'].map(p => t(p, payload));
		});
	});
});
