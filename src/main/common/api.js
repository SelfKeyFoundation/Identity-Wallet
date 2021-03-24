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
		let {
			headers = {},
			qs = {},
			body,
			formData,
			json = true,
			simple = true,
			resolveWithFullResponse = false
		} = opt;

		qs = { ...this.opt.qs, ...qs };
		headers = { ...this.opt.headers, ...headers };

		for (let key in headers) {
			if (headers[key] === null) {
				delete headers[key];
			}
		}

		for (let key in qs) {
			if (qs[key] === null) {
				delete qs[key];
			}
		}

		if (!url.startsWith('https://') && !url.startsWith('http://')) {
			url = urljoin(this.opt.endpoint, url);
		}
		method = method.toUpperCase();

		const rpOpt = { url, method, json, headers, qs, simple, resolveWithFullResponse };

		if (body) {
			rpOpt.body = body;
		}

		if (formData) {
			rpOpt.formData = formData;
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
