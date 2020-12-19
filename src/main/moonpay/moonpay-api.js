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

		this.verifyLoggedIn();
		return this.api.request({
			method: 'patch',
			url: 'customers/me',
			body: opt
		});
	}

	async verifyPhone(opt) {
		const body = validate(opt, ['verificationCode']);
		this.verifyLoggedIn();
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
