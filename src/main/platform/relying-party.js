import request from 'request-promise-native';
import config from 'common/config';

const { userAgent } = config;
export class RelyingPartyError extends Error {
	constructor(conf) {
		super(conf.message);
		this.code = conf.code;
	}
}
export class RelyingPartyCtx {
	constructor(config, identity, token) {
		this.config = config;
		this.identity = identity;
		this.token = token;
	}
	mergeWithConfig() {}
	getEndpoint() {}
	getAttributes() {}
}

export class RelyingPartyToken {
	constructor(algo, data, sig) {
		this.algo = algo;
		this.data = data;
		this.sig = sig;
	}
	static fromString(str) {}
	toString() {}
	hasExpired() {}
}

export class RelyingPartyRest {
	static userAgent = userAgent;
	static getChallange(ctx) {
		let url = ctx.getEndpoint('challange');
		return request.get({ url, headers: { 'User-Agent': this.userAgent } });
	}
	static postChallangeReply(ctx, challange, signature) {
		let url = ctx.getEndpoint('challange');
		return request.post({
			url,
			body: { signature },
			headers: { Authorization: challange, 'User-Agent': this.userAgent },
			json: true
		});
	}
	static getUserToken(ctx) {
		if (!ctx.token) throw new RelyingPartyError({ code: 401, message: 'not authorized' });
		let token = ctx.token.toString();
		let url = ctx.getEndpoint('auth/token');
		return request.get({
			url,
			headers: { Authorization: token, 'User-Agent': this.userAgent }
		});
	}
	static createUser(ctx, attributes, documents = []) {
		if (!ctx.token) throw new RelyingPartyError({ code: 401, message: 'not authorized' });
		let url = ctx.getEndpoint('user');
		let formData = documents.reduce((acc, curr) => {
			let key = `$document-${curr.id}`;
			acc[key] = {
				value: curr.buffer,
				options: {
					contentType: curr.mimeType,
					fileName: curr.name || null,
					knownSize: curr.size
				}
			};
			return acc;
		}, {});
		formData.attributes = JSON.stringify(attributes);
		return request.post({
			url,
			formData,
			headers: { Authorization: ctx.token.toString(), 'User-Agent': this.userAgent }
		});
	}
	static listKYCTemplates() {}
	static getKYCTemplate() {}
	static createKYCApplication() {}
	static listKYCApplications() {}
	static getKYCApplications() {}
	static uploadKYCApplicationFile() {}
}

export class RelyingPartySession {
	constructor(config, identity) {
		this.ctx = new RelyingPartyCtx(config, identity);
		this.identity = identity;
	}
	isActive() {
		if (!this.ctx.token) return false;
		return !this.ctx.token.hasExpired();
	}
	async establish() {
		if (this.isActive()) return this.ctx.token;
		let challange = await RelyingPartyRest.getChallange(this.ctx);
		let challangeToken = RelyingPartyToken.fromString(challange);
		let signature = await this.identity.genSignatureForMessage(challangeToken.data.challange);
		let tokenStr = await RelyingPartyRest.postChallangeReply(this.ctx, challange, signature);
		let token = RelyingPartyToken.fromString(tokenStr);
		this.ctx.token = token;
		return token;
	}
	getUserLoginPayload() {
		return RelyingPartyRest.getUserToken(this.ctx);
	}

	createUser(attributes = []) {
		let documents = attributes.reduce((acc, curr) => {
			acc = acc.concact(curr.documents);
			return documents;
		}, []);
		let attributesData = attributes.map(attr => attr.data);
		return RelyingPartyRest.createUser(this.ctx, attributesData, documents);
	}
}

export default RelyingPartySession;
