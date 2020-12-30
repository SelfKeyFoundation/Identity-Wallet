import sinon from 'sinon';
import { ParameterValidationError } from 'parameter-validator';
import MoonPayApi from './moonpay-api';
import _ from 'lodash';
import Api from '../common/api';

const ENDPOINT = 'http://test.com';
const API_KEY = 'test-key';
describe('MoonPayApi', () => {
	const opt = { endpoint: ENDPOINT, apiKey: API_KEY };

	afterEach(() => {
		sinon.restore();
	});

	describe('constructor', () => {
		it('should construct if all parameters are correct', () => {
			const mpApi = new MoonPayApi(opt);

			expect(mpApi.opt).toEqual(opt);
			expect(mpApi.api).toBeInstanceOf(Api);
			expect(mpApi.api.opt).toEqual(
				expect.objectContaining({
					endpoint: ENDPOINT,
					qs: { apiKey: API_KEY }
				})
			);
		});

		it('should throw parameter error if no opts', () => {
			try {
				// eslint-disable-next-line no-new
				new MoonPayApi(null);
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});
		it('should throw parameter error if no endpoint', () => {
			try {
				// eslint-disable-next-line no-new
				new MoonPayApi(_.omit(opt, ['endpoint']));
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});

		it('should throw parameter error if no apiKey', () => {
			try {
				// eslint-disable-next-line no-new
				new MoonPayApi(_.omit(opt, ['apiKey']));
				fail('no error thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(ParameterValidationError);
			}
		});
	});

	describe('setLoginInfo', () => {
		let mpApi;

		beforeEach(() => {
			mpApi = new MoonPayApi(opt);
		});

		it('should set login info with token', () => {
			const setHeader = sinon.stub(mpApi.api, 'setHeader');
			const loginInfo = { token: '123', customer: { id: 123 } };
			expect(mpApi.loginInfo).toBeNull();
			mpApi.setLoginInfo(loginInfo);
			expect(mpApi.loginInfo).toEqual(loginInfo);
			expect(setHeader.getCall(0).args).toEqual(['Authorization', `Bearer 123`]);
		});

		it('should set login info with csrfToken', () => {
			const setHeader = sinon.stub(mpApi.api, 'setHeader');
			const loginInfo = { csrfToken: 'csrf-token', customer: { id: 123 } };
			expect(mpApi.loginInfo).toBeNull();
			mpApi.setLoginInfo(loginInfo);
			expect(mpApi.loginInfo).toEqual(loginInfo);
			expect(setHeader.getCall(0).args).toEqual(['X-CSRF-TOKEN', `csrf-token`]);
		});

		it('should unset login info', () => {
			const setHeader = sinon.stub(mpApi.api, 'setHeader');
			mpApi.loginInfo = { token: 123 };
			mpApi.setLoginInfo(null);
			expect(mpApi.loginInfo).toBeNull();
			expect(setHeader.getCall(0).args).toEqual(['Authorization', null]);
			expect(setHeader.getCall(1).args).toEqual(['X-CSRF-TOKEN', null]);
		});

		it('should throw if no token or csrfToken in login info', () => {
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
			mpApi = new MoonPayApi(opt);
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
			mpApi = new MoonPayApi(opt);
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

		const testMissingParam = (parameter, method, opt) =>
			testInvalidParam(`no ${parameter} passed`, method, _.omit(opt, parameter));

		const testInvalidParam = (message, method, opt) =>
			it(`${method} should throw ParameterValidationError if ${message}`, async () => {
				try {
					sinon.stub(mpApi.api, 'request').resolves();
					sinon.stub(mpApi, 'isLoggedIn').returns(true);
					await mpApi[method](opt);
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(ParameterValidationError);
				}
			});

		const testLoggedIn = (method, opt) =>
			it(`${method} should reject if not logged in`, async () => {
				sinon.stub(mpApi.api, 'request').resolves();
				sinon.stub(mpApi, 'isLoggedIn').returns(false);
				try {
					await mpApi[method](opt);
					fail('no error thrown');
				} catch (error) {
					expect(error).toBeInstanceOf(Error);
					expect(error.message).toEqual('not logged in');
				}
			});

		beforeEach(() => {
			mpApi = new MoonPayApi(opt);
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

			['walletAddress', 'email'].map(parameter =>
				testMissingParam(parameter, 'getChallenge', data)
			);
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

			['walletAddress', 'email', 'signature'].map(parameter =>
				testMissingParam(parameter, 'postChallenge', data)
			);
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
				const signer = sinon.stub().resolves(SIGNATURE);
				const setLogin = sinon.stub(mpApi, 'setLoginInfo');

				const resp = await mpApi.establishSession(data, signer);

				expect(c.getCall(0).args[0]).toEqual(data);
				expect(signer.getCall(0).args[0]).toEqual(NONCE);
				expect(pc.getCall(0).args[0]).toEqual({ ...data, signature: SIGNATURE });

				expect(resp).toEqual(response);
				expect(setLogin.getCall(0).args[0]).toEqual(response);
			});

			['walletAddress', 'email'].map(parameter =>
				testMissingParam(parameter, 'establishSession', data)
			);
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

			testLoggedIn('getCustomer');
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

			testLoggedIn('updateCustomer');
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
			testLoggedIn('verifyPhone');

			['verificationCode'].map(parameter =>
				testMissingParam(parameter, 'verifyPhone', payload)
			);
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

			testLoggedIn('refreshToken');
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

			['currencyCode'].map(parameter =>
				testMissingParam(parameter, 'getCurrencyPrice', { currencyCode })
			);
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

			['cryptoCurrencies', 'fiatCurrencies'].map(parameter =>
				testMissingParam(parameter, 'listCurrencyPrices', {
					cryptoCurrencies,
					fiatCurrencies
				})
			);
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

			['baseCurrencyAmount', 'baseCurrencyCode', 'currencyCode'].map(parameter =>
				testMissingParam(parameter, 'getQuote', {
					currencyCode,
					baseCurrencyCode,
					baseCurrencyAmount,
					extraFeePercentage
				})
			);

			testInvalidParam('payment method not supported', 'getQuote', {
				currencyCode,
				baseCurrencyCode,
				baseCurrencyAmount,
				paymentMethod: 'test'
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

			testLoggedIn('getLimits');
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
			['fileType'].map(parameter =>
				testMissingParam(parameter, '_genS3SignedRequest', {
					fileType
				})
			);
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

			['file', 'signedRequest'].map(parameter =>
				testMissingParam(parameter, '_uploadToS3', {
					file,
					signedRequest
				})
			);

			testInvalidParam('file is not buffer', '_uploadToS3', {
				signedRequest,
				file: 'test file'
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

			['key', 'type', 'country'].map(parameter =>
				testMissingParam(parameter, '_createFile', {
					key,
					type,
					country,
					side
				})
			);

			testInvalidParam('type not supported', '_createFile', {
				key,
				type: 'not_supported',
				country,
				side
			});

			testInvalidParam('type national_identity_card and no side', '_createFile', {
				key,
				type: 'national_identity_card',
				country
			});

			testInvalidParam('type driving_licence and no side', '_createFile', {
				key,
				type: 'national_identity_card',
				country
			});

			testInvalidParam('side is not front or back', '_createFile', {
				key,
				type,
				country,
				side: 'invalid_side'
			});

			testLoggedIn('_createFile');
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

			['file', 'fileType', 'type', 'country'].map(parameter =>
				testMissingParam(parameter, 'uploadFile', {
					file,
					fileType,
					type,
					country,
					side
				})
			);

			testInvalidParam('file is not buffer', 'uploadFile', {
				file: 'test file',
				fileType,
				type,
				country,
				side
			});

			testInvalidParam('type not supported', 'uploadFile', {
				file,
				fileType,
				type: 'not_supported',
				country,
				side
			});

			testInvalidParam('type national_identity_card and no side', 'uploadFile', {
				file,
				fileType,
				type: 'national_identity_card',
				country
			});

			testInvalidParam('type driving_licence and no side', 'uploadFile', {
				file,
				fileType,
				type: 'driving_licence',
				country
			});

			testInvalidParam('side is not front or back', 'uploadFile', {
				file,
				fileType,
				type,
				country,
				side: 'invalid_side'
			});

			testLoggedIn('uploadFile');
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

			testLoggedIn('listFiles');
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

			testLoggedIn('createToken');

			testInvalidParam('country USA and no state', 'createToken', {
				...payload,
				billingAddress: {
					..._.omit(payload.billingAddress, ['state']),
					country: 'USA'
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
			].map(p => testMissingParam(p, 'createToken', payload));
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

			testLoggedIn('createCard');

			['tokenId'].map(p => testMissingParam(p, 'createCard', payload));
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

			testLoggedIn('listCards');
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

			it('should delete card', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.deleteCard(payload);
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'delete',
					url: `cards/${payload.cardId}`
				});
			});

			testLoggedIn('deleteCard');

			['cardId'].map(p => testMissingParam(p, 'deleteCard', payload));
		});

		describe('createBankAccount', () => {
			const expectedResponse = {
				id: '74b38e1a-d636-4faa-909a-24e0beeb5b08',
				createdAt: '2019-10-24T08:43:32.013Z',
				updatedAt: '2019-10-24T08:43:32.013Z',
				iban: 'AT622905300345678901',
				bic: 'OSTBATYYZZZ',
				accountNumber: null,
				sortCode: null,
				bankName: 'Bank Österreich',
				currencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
				customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
			};

			const payload = {
				currencyCode: 'EUR',
				iban: 'AT622905300345678901'
			};

			it('should create bank account', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.createBankAccount(payload);
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'post',
					url: 'bank_accounts',
					body: { currencyCode: 'eur', iban: 'AT622905300345678901' }
				});
			});

			testLoggedIn('createBankAccount');

			['currencyCode'].map(p => testMissingParam(p, 'createBankAccount', payload));

			testInvalidParam('currencyCode not supported', 'createBankAccount', {
				currencyCode: 'test'
			});

			testInvalidParam('eur and no iban', 'createBankAccount', {
				currencyCode: 'eur'
			});

			testInvalidParam('gbp and no account number', 'createBankAccount', {
				currencyCode: 'gbp',
				sortCode: '1231'
			});

			testInvalidParam('gbp and no sortCode', 'createBankAccount', {
				currencyCode: 'gbp',
				accountNumber: 'sfasdawa'
			});
		});

		describe('listBankAccounts', () => {
			const expectedResponse = [
				{
					id: '74b38e1a-d636-4faa-909a-24e0beeb5b08',
					createdAt: '2019-10-24T08:43:32.013Z',
					updatedAt: '2019-10-24T08:43:32.013Z',
					iban: 'AT622905300345678901',
					bic: 'OSTBATYYZZZ',
					accountNumber: null,
					sortCode: null,
					bankName: 'Bank Österreich',
					currencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
					customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
				},
				{
					id: '43851745-533f-4cd0-b6f4-66652f194125',
					createdAt: '2019-11-05T09:50:02.011Z',
					updatedAt: '2019-11-05T09:50:02.011Z',
					iban: null,
					bic: null,
					accountNumber: '31247568',
					sortCode: '531246',
					bankName: 'City of Glasgow Bank',
					currencyId: '6f424585-8936-4eb1-b01e-443fb306d1f5',
					customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
				}
			];

			it('should list bank accounts', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.listBankAccounts();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: 'bank_accounts'
				});
			});

			testLoggedIn('listBankAccounts');
		});

		describe('deleteBankAccount', () => {
			const expectedResponse = {
				id: '74b38e1a-d636-4faa-909a-24e0beeb5b08',
				createdAt: '2019-10-24T08:43:32.013Z',
				updatedAt: '2019-10-24T08:43:32.013Z',
				iban: 'AT622905300345678901',
				bic: 'OSTBATYYZZZ',
				accountNumber: null,
				sortCode: null,
				bankName: 'Bank Österreich',
				currencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
				customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6'
			};

			const payload = {
				bankAccountId: '74b38e1a-d636-4faa-909a-24e0beeb5b08'
			};

			it('should delete bank account', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.deleteBankAccount(payload);
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'delete',
					url: `bank_accounts/${payload.bankAccountId}`
				});
			});

			testLoggedIn('deleteBankAccount');

			['bankAccountId'].map(p => testMissingParam(p, 'deleteBankAccount', payload));
		});

		describe('createBankTransaction', () => {
			const expectedResponse = {
				id: 'ca83aa45-fa6b-446d-b01d-33a062db16e8',
				createdAt: '2018-10-11T07:30:42.858Z',
				updatedAt: '2018-10-11T07:30:42.858Z',
				baseCurrencyAmount: 40,
				quoteCurrencyAmount: null,
				feeAmount: 4.99,
				extraFeeAmount: 2.5,
				networkFeeAmount: 0,
				areFeesIncluded: false,
				status: 'waitingPayment',
				failureReason: null,
				walletAddress: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
				walletAddressTag: null,
				cryptoTransactionId: null,
				returnUrl: null,
				redirectUrl: null,
				baseCurrencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
				currencyId: 'e1c58187-7486-4291-a95e-0a8a1e8ef51d',
				customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6',
				cardId: null,
				bankAccountId: '74b38e1a-d636-4faa-909a-24e0beeb5b08',
				bankDepositInformation: {
					iban: 'ZZ135790000087654321',
					bic: 'ABCDZZ21XXX',
					bankName: 'Cosmic Bank',
					bankAddress: '123 Luna Lane, London LL1 1LL, United Kingdom',
					accountName: 'Moon Pay Limited',
					accountAddress: 'Triq l-Uqija, Swieqi SWQ 2332, Malta'
				},
				bankTransferReference: 'jTxDd17ATQ',
				eurRate: 1,
				usdRate: 1.11341,
				gbpRate: 0.86046,
				externalTransactionId: null
			};

			const payload = {
				baseCurrencyAmount: 40,
				extraFeePercentage: 5,
				walletAddress: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
				baseCurrencyCode: 'eur',
				currencyCode: 'eth',
				bankAccountId: '74b38e1a-d636-4faa-909a-24e0beeb5b08'
			};

			it('should create bank transaction', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.createBankTransaction(payload);
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'post',
					url: 'transactions',
					body: payload
				});
			});

			testLoggedIn('createBankTransaction');

			[
				'baseCurrencyAmount',
				'extraFeePercentage',
				'walletAddress',
				'baseCurrencyCode',
				'currencyCode',
				'bankAccountId'
			].map(p => testMissingParam(p, 'createBankTransaction', payload));
		});
		describe('createCardTransaction', () => {
			const expectedResponse = {
				id: '354b1f46-480c-4307-9896-f4c81c1e1e17',
				createdAt: '2018-08-27T19:40:43.748Z',
				updatedAt: '2018-08-27T19:40:43.748Z',
				baseCurrencyAmount: 50,
				quoteCurrencyAmount: null,
				feeAmount: 4.99,
				extraFeeAmount: 2.5,
				networkFeeAmount: 0,
				areFeesIncluded: false,
				status: 'pending',
				failureReason: null,
				walletAddress: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
				walletAddressTag: null,
				cryptoTransactionId: null,
				returnUrl: 'https://buy.moonpay.com',
				redirectUrl: null,
				baseCurrencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
				currencyId: 'e1c58187-7486-4291-a95e-0a8a1e8ef51d',
				customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6',
				cardId: '68e46314-93e5-4420-ac10-485aef4e19d0',
				bankAccountId: null,
				bankDepositInformation: null,
				bankTransferReference: null,
				eurRate: 1,
				usdRate: 1.11336,
				gbpRate: 0.86044,
				externalTransactionId: null
			};

			const payload = {
				baseCurrencyAmount: 50,
				extraFeePercentage: 5,
				walletAddress: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
				baseCurrencyCode: 'eur',
				currencyCode: 'eth',
				returnUrl: 'https://buy.moonpay.com',
				tokenId: 'fc33e149-1f18-4cc9-841e-0d28c13410bf'
			};

			it('should create card transaction', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.createCardTransaction(payload);
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'post',
					url: 'transactions',
					body: payload
				});
			});

			testLoggedIn('createCardTransaction');

			[
				'baseCurrencyAmount',
				'extraFeePercentage',
				'walletAddress',
				'baseCurrencyCode',
				'currencyCode',
				'returnUrl'
			].map(p => testMissingParam(p, 'createCardTransaction', payload));

			testInvalidParam(
				'no tokenId or cardId',
				'createCardTransaction',
				_.omit(payload, ['tokenId'])
			);
		});

		describe('getTransaction', () => {
			const expectedResponse = {
				id: '354b1f46-480c-4307-9896-f4c81c1e1e17',
				createdAt: '2018-08-27T19:40:43.748Z',
				updatedAt: '2018-08-27T19:40:43.804Z',
				baseCurrencyAmount: 50,
				quoteCurrencyAmount: 0.12255,
				feeAmount: 4.99,
				extraFeeAmount: 2.5,
				networkFeeAmount: 0,
				areFeesIncluded: false,
				status: 'completed',
				failureReason: null,
				walletAddress: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
				walletAddressTag: null,
				cryptoTransactionId:
					'0x548b15d1673d4a8c9ab93a48bc8b42e223c5f7776cea6044b91d0f3fe79b0bd6',
				returnUrl: 'https://buy.moonpay.com',
				redirectUrl: null,
				baseCurrencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
				currencyId: 'e1c58187-7486-4291-a95e-0a8a1e8ef51d',
				customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6',
				cardId: '68e46314-93e5-4420-ac10-485aef4e19d0',
				bankAccountId: null,
				bankDepositInformation: null,
				bankTransferReference: null,
				eurRate: 1,
				usdRate: 1.11336,
				gbpRate: 0.86044,
				externalTransactionId: null
			};

			const payload = { transactionId: expectedResponse.id };

			it('should get transaction', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.getTransaction(payload);
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: `transactions/${payload.transactionId}`
				});
			});

			testLoggedIn('getTransaction');

			['transactionId'].map(p => testMissingParam(p, 'getTransaction', payload));
		});

		describe('listTransactions', () => {
			const expectedResponse = [
				{
					id: 'ca83aa45-fa6b-446d-b01d-33a062db16e8',
					createdAt: '2018-10-11T07:30:42.858Z',
					updatedAt: '2018-10-11T07:30:42.858Z',
					baseCurrencyAmount: 40,
					quoteCurrencyAmount: 0.12576,
					feeAmount: 4.99,
					extraFeeAmount: 2.5,
					networkFeeAmount: 0,
					areFeesIncluded: false,
					status: 'completed',
					failureReason: null,
					walletAddress: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
					walletAddressTag: null,
					cryptoTransactionId:
						'0x548b15d1673d4a8c9ab93a48bc8b42e223c5f7776cea6044b91d0f3fe79b0cf8',
					returnUrl: null,
					redirectUrl: null,
					baseCurrencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
					currencyId: 'e1c58187-7486-4291-a95e-0a8a1e8ef51d',
					customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6',
					cardId: null,
					bankAccountId: '74b38e1a-d636-4faa-909a-24e0beeb5b08',
					bankDepositInformation: {
						iban: 'ZZ135790000087654321',
						bic: 'ABCDZZ21XXX',
						bankName: 'Cosmic Bank',
						bankAddress: '123 Luna Lane, London LL1 1LL, United Kingdom',
						accountName: 'Moon Pay Limited',
						accountAddress: 'Triq l-Uqija, Swieqi SWQ 2332, Malta'
					},
					bankTransferReference: 'jTxDd17ATQ',
					eurRate: 1,
					usdRate: 1.11341,
					gbpRate: 0.86046,
					externalTransactionId: null
				},
				{
					id: '354b1f46-480c-4307-9896-f4c81c1e1e17',
					createdAt: '2018-08-27T19:45:43.748Z',
					updatedAt: '2018-08-27T19:45:43.804Z',
					baseCurrencyAmount: 50,
					quoteCurrencyAmount: 0.12255,
					feeAmount: 4.99,
					extraFeeAmount: 2.5,
					networkFeeAmount: 0,
					areFeesIncluded: false,
					status: 'completed',
					failureReason: null,
					walletAddress: '0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2',
					walletAddressTag: null,
					cryptoTransactionId:
						'0x548b15d1673d4a8c9ab93a48bc8b42e223c5f7776cea6044b91d0f3fe79b0bd6',
					returnUrl: 'https://buy.moonpay.com',
					redirectUrl: null,
					baseCurrencyId: '71435a8d-211c-4664-a59e-2a5361a6c5a7',
					currencyId: 'e1c58187-7486-4291-a95e-0a8a1e8ef51d',
					customerId: '7138fb07-7c66-4f9a-a83a-a106e66bfde6',
					cardId: '68e46314-93e5-4420-ac10-485aef4e19d0',
					bankAccountId: null,
					bankDepositInformation: null,
					bankTransferReference: null,
					eurRate: 1,
					usdRate: 1.11336,
					gbpRate: 0.86044,
					externalTransactionId: null
				}
			];

			it('should list transactions', async () => {
				const rp = sinon.stub(mpApi.api, 'request').resolves(expectedResponse);
				sinon.stub(mpApi, 'isLoggedIn').returns(true);
				const resp = await mpApi.listTransactions();
				expect(resp).toEqual(expectedResponse);
				expect(rp.getCall(0).args[0]).toEqual({
					method: 'get',
					url: `transactions`
				});
			});

			testLoggedIn('listTransactions');
		});
	});
});
