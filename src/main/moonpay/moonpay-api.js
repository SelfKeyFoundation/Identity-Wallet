import { validate, ParameterValidationError } from 'parameter-validator';
import _ from 'lodash';
import Api from '../common/api';
import { Logger } from 'common/logger';

const log = new Logger('MoonPayApi');

export class MoonPayApi {
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

	async refreshToken() {
		this.verifyLoggedIn();
		const loginInfo = await this.api.request({
			method: 'get',
			url: 'customers/refresh_token'
		});
		this.setLoginInfo(loginInfo);
		return loginInfo;
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
