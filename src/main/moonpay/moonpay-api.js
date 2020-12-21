import { validate, ParameterValidationError } from 'parameter-validator';
import _ from 'lodash';
import Api from '../common/api';
import { Logger } from 'common/logger';

const log = new Logger('MoonPayApi');

export class MoonPayApi {
	static PAYMENT_METHODS = ['credit_debit_card', 'sepa_bank_transfer', 'gbp_bank_transfer'];
	static DEFAULT_PAYMENT_METHOD = 'credit_debit_card';
	static FILE_TYPES = ['passport', 'national_identity_card', 'driving_licence', 'selfie'];
	static FILE_SIDES = ['front', 'back'];
	static FILES_REQUIRING_SIDE = ['national_identity_card', 'driving_licence'];
	static COUNTRIES_REQUIRING_STATE = ['USA'];
	static BANK_ACCOUNT_CURRENCIES = ['eur', 'gbp'];
	static BANK_ACCOUNT_CURRENCIES_REQUIRING_IBAN = ['eur'];
	static BANK_ACCOUNT_CURRENCIES_REQUIRING_ACCOUNT = ['gbp'];
	static BANK_ACCOUNT_CURRENCIES_REQUIRING_SORT_CODE = ['gbp'];

	static TEST_CARDS_SUCCESS = [
		{
			cardType: 'Visa',
			number: '4000 0231 0466 253',
			expiryDate: '12/2020',
			cvs: '123'
		},
		{
			cardType: 'Visa',
			number: '4002 6297 9820 5148',
			expiryDate: '12/2020',
			cvs: '123'
		},
		{
			cardType: 'Mastercard',
			number: '5101 0822 4004 9218',
			expiryDate: '12/2020',
			cvs: '123'
		},
		{
			cardType: 'Mastercard',
			number: '5333 3009 8952 1936',
			expiryDate: '12/2020',
			cvs: '123'
		}
	];

	static TEST_CARDS_FAIL = [
		{
			cardType: 'Visa',
			number: '4008 3708 9666 2369',
			expiryDate: '12/2020',
			cvs: '123'
		},
		{
			cardType: 'Mastercard',
			number: '5101 1186 1177 9692',
			expiryDate: '12/2020',
			cvs: '123'
		}
	];

	static TEST_CARD_3D_SECURE = [
		{
			cardType: 'Visa',
			number: '4012 0010 3749 0014',
			expiryDate: '12/2020',
			cvs: '123'
		},
		{
			cardType: 'Mastercard',
			number: '2221 0080 1217 4837',
			expiryDate: '12/2020',
			cvs: '123'
		}
	];

	static TEST_BCH_ADDRESS = 'bchtest:qrn45hfjpqd0w5p7dur5a2aasgp3nj8d8qh4exym5k';
	static TEST_BTC_ADDRESS = 'tb1q45h8zexwztmz3nyd8gmkxhpavdsva4znwwhzvs';
	static TEST_ETH_ADDRESS = '0xc216eD2D6c295579718dbd4a797845CdA70B3C36';
	static TEST_XPR_ADDRESS = 'rUZTCFB6zPyeEmDhrAVqVbBaLPWrzjKCQz';
	static TEST_STELLAR_ADDRESS = 'GD4KAFADEFXOLNWWUA4IZI5YG23AH2OSJMIJAZ6YLNHJWNPX3T366FIY';

	constructor(identity, opt) {
		if (!identity) throw new ParameterValidationError('"identity" is a required parameter');
		if (!opt) throw new ParameterValidationError('"opt" is a required parameter');
		validate(opt, ['endpoint', 'apiKey']);
		this.identity = identity;
		this.loginInfo = null;
		this.opt = opt;
		const apiOpt = {
			endpoint: opt.endpoint,
			qs: { apiKey: opt.apiKey },
			onRequestError: this.handleRequestError.bind(this)
		};
		this.api = new Api(apiOpt);
	}

	handleRequestError(error) {
		log.error('Request error %s', error);
		if (error.statusCode === 401) {
			this.setLoginInfo(null);
		}
		throw error;
	}

	async getChallenge(data) {
		validate(data, ['email', 'walletAddress']);
		try {
			const resp = await this.api.request({
				method: 'post',
				url: '/customers/wallet_address_login',
				body: _.pick(data, ['email', 'walletAddress'])
			});
			return resp.nonce;
		} catch (error) {
			log.error(error);
			throw error;
		}
	}

	async postChallenge(data) {
		validate(data, ['email', 'walletAddress', 'signature']);
		try {
			const resp = await this.api.request({
				method: 'post',
				url: '/customers/wallet_address_login',
				body: _.pick(data, ['email', 'walletAddress', 'signature'])
			});
			return resp;
		} catch (error) {
			log.error(error);
			throw error;
		}
	}

	async establishSession(data) {
		validate(data, ['email', 'walletAddress']);
		const nonce = await this.getChallenge(data);
		const signature = await this.identity.genSignatureForMessage(nonce);
		const loginInfo = await this.postChallenge({ ...data, signature });
		this.setLoginInfo(loginInfo);
		return loginInfo;
	}

	async getCustomer() {
		this.verifyLoggedIn();
		return this.api.request({
			method: 'get',
			url: 'customers/me'
		});
	}

	async updateCustomer(opt) {
		this.verifyLoggedIn();
		opt = _.pick(opt, [
			'firstName',
			'lastName',
			'email',
			'phoneNumber',
			'dateOfBirth',
			'address',
			'defaultCurrencyId'
		]);

		if (opt.address) {
			opt.address = _.pick(opt.address, [
				'street',
				'subStreet',
				'town',
				'postCode',
				'state',
				'country'
			]);
		}

		return this.api.request({
			method: 'patch',
			url: 'customers/me',
			body: opt
		});
	}

	async verifyPhone(opt) {
		this.verifyLoggedIn();
		const body = validate(opt, ['verificationCode']);
		return this.api.request({
			method: 'post',
			url: 'customers/verify_phone_number',
			body
		});
	}

	async refreshToken() {
		this.verifyLoggedIn();
		const loginInfo = await this.api.request({
			method: 'get',
			url: 'customers/refresh_token'
		});
		this.setLoginInfo(loginInfo);
		return loginInfo;
	}

	async getLimits() {
		this.verifyLoggedIn();
		const limits = await this.api.request({
			method: 'get',
			url: 'customers/me/limits'
		});
		return limits;
	}

	async getAccount() {
		const account = await this.api.request({
			method: 'get',
			url: 'accounts/me'
		});

		return account;
	}

	async listCurrencies() {
		const currencies = await this.api.request({
			method: 'get',
			url: 'currencies'
		});

		return currencies;
	}

	async getCurrencyPrice(opt) {
		const { currencyCode } = validate(opt, ['currencyCode']);

		const price = await this.api.request({
			method: 'get',
			url: `currencies/${currencyCode}/price`
		});
		return price;
	}

	async listCurrencyPrices(opt) {
		let { cryptoCurrencies, fiatCurrencies } = validate(opt, [
			'cryptoCurrencies',
			'fiatCurrencies'
		]);

		cryptoCurrencies = cryptoCurrencies.join(',').toLowerCase();
		fiatCurrencies = fiatCurrencies.join(',').toLowerCase();

		const prices = await this.api.request({
			method: 'get',
			url: `currencies/price`,
			qs: { cryptoCurrencies, fiatCurrencies }
		});
		return prices;
	}

	async getQuote(opt) {
		let { currencyCode, baseCurrencyCode, baseCurrencyAmount } = validate(opt, [
			'currencyCode',
			'baseCurrencyCode',
			'baseCurrencyAmount'
		]);
		let { paymentMethod, extraFeePercentage, areFeesIncluded } = opt;
		if (!paymentMethod) {
			paymentMethod = this.constructor.DEFAULT_PAYMENT_METHOD;
		}

		paymentMethod = paymentMethod.toLowerCase();

		if (!this.constructor.PAYMENT_METHODS.includes(paymentMethod)) {
			throw new ParameterValidationError(
				`unsupported payment methods, choose one of ${this.constructor.PAYMENT_METHODS.join(
					', '
				)}`
			);
		}

		const qs = {
			baseCurrencyCode: baseCurrencyCode.toLowerCase(),
			baseCurrencyAmount: +baseCurrencyAmount,
			paymentMethod
		};

		if (extraFeePercentage) {
			qs.extraFeePercentage = +extraFeePercentage;
		}

		if (areFeesIncluded) {
			qs.areFeesIncluded = areFeesIncluded ? 'true' : 'false';
		}

		const quote = await this.api.request({
			method: 'get',
			url: `currencies/${currencyCode.toLowerCase()}/quote`,
			qs
		});
		return quote;
	}

	async listCountries() {
		const countries = await this.api.request({
			method: 'get',
			url: 'countries'
		});

		return countries;
	}

	async getIpAddress() {
		const ipAddress = await this.api.request({
			method: 'get',
			url: 'ip_address'
		});

		return ipAddress;
	}

	async _genS3SignedRequest(opt) {
		opt = validate(opt, ['fileType']);

		const signedRequest = await this.api.request({
			method: 'get',
			url: 'files/s3_signed_request',
			qs: opt
		});

		return signedRequest;
	}

	async _uploadToS3(opt) {
		const { file, signedRequest } = validate(opt, ['file', 'signedRequest']);

		if (!Buffer.isBuffer(file)) {
			throw new ParameterValidationError('file needs to be a buffer');
		}
		const res = await this.api.request({
			method: 'put',
			url: signedRequest,
			formData: {
				document: {
					value: file
				}
			}
		});

		return res;
	}

	async _createFile(opt) {
		this.verifyLoggedIn();
		const { key, type, country } = validate(opt, ['key', 'type', 'country']);
		const { side } = opt;

		if (!this.constructor.FILE_TYPES.includes(type)) {
			throw new ParameterValidationError(
				`${type} file type is not supported. Supported are: ${this.constructor.FILE_TYPES.join(
					', '
				)}`
			);
		}

		if (side && !this.constructor.FILE_SIDES.includes(side)) {
			throw new ParameterValidationError(
				`${side} is not supported file side. Supported are ${this.constructor.FILE_SIDES.join(
					', '
				)}`
			);
		}

		if (!side && this.constructor.FILES_REQUIRING_SIDE.includes(type)) {
			throw new ParameterValidationError(`File of type ${type} requires a side`);
		}

		const body = {
			key,
			type,
			country
		};

		if (side) {
			body.side = side;
		}

		this.verifyLoggedIn();

		const res = await this.api.request({
			method: 'post',
			url: 'files',
			body
		});

		return res;
	}

	async uploadFile(opt) {
		this.verifyLoggedIn();

		const { file, fileType, type, country } = validate(opt, [
			'file',
			'fileType',
			'type',
			'country'
		]);
		const { side } = opt;

		if (!Buffer.isBuffer(file)) {
			throw new ParameterValidationError('file needs to be a buffer');
		}

		if (!this.constructor.FILE_TYPES.includes(type)) {
			throw new ParameterValidationError(
				`${type} file type is not supported. Supported are: ${this.constructor.FILE_TYPES.join(
					', '
				)}`
			);
		}

		if (side && !this.constructor.FILE_SIDES.includes(side)) {
			throw new ParameterValidationError(
				`${side} is not supported file side. Supported are ${this.constructor.FILE_SIDES.join(
					', '
				)}`
			);
		}

		if (!side && this.constructor.FILES_REQUIRING_SIDE.includes(type)) {
			throw new ParameterValidationError(`File of type ${type} requires a side`);
		}

		const signedRequest = await this._genS3SignedRequest({ fileType });

		await this._uploadToS3({
			file,
			signedRequest: signedRequest.signedRequest
		});

		const res = await this._createFile({
			key: signedRequest.key,
			type,
			country,
			side
		});

		return res;
	}

	async listFiles() {
		this.verifyLoggedIn();
		return this.api.request({
			method: 'get',
			url: 'files'
		});
	}

	async createToken(opt) {
		this.verifyLoggedIn();
		const body = validate(opt, ['expiryDate', 'number', 'cvc', 'billingAddress']);
		body.billingAddress = validate(opt.billingAddress, [
			'street',
			'subStreet',
			'town',
			'postCode',
			'country'
		]);
		const { state, country } = opt.billingAddress;

		if (this.constructor.COUNTRIES_REQUIRING_STATE.includes(country) && !state) {
			throw new ParameterValidationError(`state is required for ${country}`);
		}

		if (state) {
			body.billingAddress.state = state;
		}

		return this.api.request({
			method: 'post',
			url: 'tokens',
			body
		});
	}

	async createCard(opt) {
		this.verifyLoggedIn();
		opt = validate(opt, ['tokenId']);
		return this.api.request({
			method: 'post',
			url: 'cards',
			body: opt
		});
	}

	async listCards() {
		this.verifyLoggedIn();
		return this.api.request({
			method: 'get',
			url: 'cards'
		});
	}

	async deleteCard(opt) {
		this.verifyLoggedIn();
		const { cardId } = validate(opt, ['cardId']);
		return this.api.request({
			method: 'delete',
			url: `cards/${cardId}`
		});
	}

	async createBankAccount(opt) {
		this.verifyLoggedIn();
		let { currencyCode } = validate(opt, ['currencyCode']);
		currencyCode = currencyCode.toLowerCase();

		let body = { currencyCode };

		if (!this.constructor.BANK_ACCOUNT_CURRENCIES.includes(currencyCode)) {
			throw new ParameterValidationError(`Currency ${currencyCode} is not supported`);
		}

		if (this.constructor.BANK_ACCOUNT_CURRENCIES_REQUIRING_IBAN.includes(currencyCode)) {
			body = { ...body, ...validate(opt, ['iban']) };
		}

		if (this.constructor.BANK_ACCOUNT_CURRENCIES_REQUIRING_ACCOUNT.includes(currencyCode)) {
			body = { ...body, ...validate(opt, ['accountNumber']) };
		}

		if (this.constructor.BANK_ACCOUNT_CURRENCIES_REQUIRING_SORT_CODE.includes(currencyCode)) {
			body = { ...body, ...validate(opt, ['sortCode']) };
		}

		return this.api.request({
			method: 'post',
			url: 'bank_accounts',
			body
		});
	}

	async listBankAccounts() {
		this.verifyLoggedIn();

		return this.api.request({
			method: 'get',
			url: 'bank_accounts'
		});
	}

	async deleteBankAccount(opt) {
		this.verifyLoggedIn();

		const { bankAccountId } = validate(opt, ['bankAccountId']);

		return this.api.request({
			method: 'delete',
			url: `bank_accounts/${bankAccountId}`
		});
	}

	async createBankTransaction(opt) {
		this.verifyLoggedIn();
		const {
			baseCurrencyAmount,
			extraFeePercentage,
			walletAddress,
			baseCurrencyCode,
			currencyCode,
			bankAccountId
		} = validate(opt, [
			'baseCurrencyAmount',
			'extraFeePercentage',
			'walletAddress',
			'baseCurrencyCode',
			'currencyCode',
			'bankAccountId'
		]);

		const { walletAddressTag, externalTransactionId } = opt;

		return this.api.request({
			method: 'post',
			url: 'transactions',
			body: {
				baseCurrencyAmount,
				extraFeePercentage,
				walletAddress,
				baseCurrencyCode,
				currencyCode,
				bankAccountId,
				walletAddressTag,
				externalTransactionId
			}
		});
	}

	async createCardTransaction(opt) {
		this.verifyLoggedIn();
		const {
			baseCurrencyAmount,
			extraFeePercentage,
			walletAddress,
			baseCurrencyCode,
			currencyCode,
			returnUrl
		} = validate(opt, [
			'baseCurrencyAmount',
			'extraFeePercentage',
			'walletAddress',
			'baseCurrencyCode',
			'currencyCode',
			'returnUrl'
		]);

		const { walletAddressTag, externalTransactionId, cardId, tokenId } = opt;

		if (!cardId && !tokenId) {
			throw new ParameterValidationError('one of cardId, tokenId is required');
		}

		return this.api.request({
			method: 'post',
			url: 'transactions',
			body: {
				baseCurrencyAmount,
				extraFeePercentage,
				walletAddress,
				baseCurrencyCode,
				currencyCode,
				returnUrl,
				walletAddressTag,
				externalTransactionId,
				cardId,
				tokenId
			}
		});
	}

	async getTransaction(opt) {
		this.verifyLoggedIn();
		const { transactionId } = validate(opt, ['transactionId']);

		return this.api.request({
			method: 'get',
			url: `transactions/${transactionId}`
		});
	}

	async listTransactions(opt) {
		this.verifyLoggedIn();
		return this.api.request({
			method: 'get',
			url: `transactions`
		});
	}

	setLoginInfo(loginInfo) {
		if (!loginInfo) {
			this.loginInfo = null;
			this.api.setHeader('Authorization', null);
			return;
		}
		validate(loginInfo, ['token', 'customer']);
		this.loginInfo = loginInfo;
		this.api.setHeader('Authorization', `Bearer ${loginInfo.token}`);
	}

	verifyLoggedIn() {
		if (!this.isLoggedIn()) {
			throw new Error('not logged in');
		}
	}

	getLoginInfo() {
		return this.loginInfo;
	}

	isLoggedIn() {
		return !!this.getLoginInfo();
	}
}

export default MoonPayApi;
