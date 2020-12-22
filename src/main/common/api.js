import urljoin from 'url-join';
import rp from 'request-promise-native';
import { validate } from 'parameter-validator';

export class Api {
	constructor(opt) {
		validate(opt, ['endpoint']);
		this.opt = { headers: {}, qs: {}, ...opt };
	}

	async request(opt) {
		let { url, method } = validate(opt, ['url', 'method']);
		let { headers = {}, qs = {}, body } = opt;
		qs = { ...this.opt.qs, ...qs };
		headers = { ...this.opt.headers, ...headers };
		url = urljoin(this.opt.endpoint, url);
		method = method.toUpperCase();
		const rpOpt = { url, method, json: true, headers, qs };

		if (body) {
			rpOpt.body = body;
		}
		try {
			const resp = await rp(rpOpt);
			return resp;
		} catch (error) {
			if (this.opt.onRequestError && error.statusCode) {
				return this.opt.onRequestError(error);
			}
			throw error;
		}
	}

	setHeader(name, value = null) {
		const opt = { ...this.opt };
		const headers = { ...opt.headers };

		if (value === null) {
			delete headers[name];
		} else {
			headers[name] = value;
		}
		opt.headers = headers;
		this.opt = opt;
	}
}

export default Api;
