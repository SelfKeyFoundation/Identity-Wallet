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
	getOrigin() {
		return this.config.origin || 'IDW';
	}
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
	static getAuthorizationHeader(token) {
		return `Bearer ${token}`;
	}
	static getChallenge(ctx) {
		let url = ctx.getEndpoint('challenge');
		return request.get({
			url,
			headers: { 'User-Agent': this.userAgent, Origin: ctx.getOrigin() }
		});
	}
	static postChallengeReply(ctx, challenge, signature) {
		let url = ctx.getEndpoint('challenge');
		return request.post({
			url,
			body: { signature },
			headers: {
				Authorization: this.getAuthorizationHeader(challenge),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			},
			json: true
		});
	}
	static getUserToken(ctx) {
		if (!ctx.token) throw new RelyingPartyError({ code: 401, message: 'not authorized' });
		let token = ctx.token.toString();
		let url = ctx.getEndpoint('auth/token');
		return request.get({
			url,
			headers: {
				Authorization: this.getAuthorizationHeader(token),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			}
		});
	}
	static createUser(ctx, attributes, documents = []) {
		if (!ctx.token) throw new RelyingPartyError({ code: 401, message: 'not authorized' });
		let url = ctx.getEndpoint('users');
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
		formData.attributes = {
			value: JSON.stringify(attributes),
			options: {
				contentType: 'application/json'
			}
		};
		return request.post({
			url,
			formData,
			headers: {
				Authorization: this.getAuthorizationHeader(ctx.token.toString()),
				'User-Agent': this.userAgent,
				Origin: ctx.getOrigin()
			}
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
		let challenge = await RelyingPartyRest.getChallenge(this.ctx);
		let challengeToken = RelyingPartyToken.fromString(challenge);
		let signature = await this.identity.genSignatureForMessage(challengeToken.data.challenge);
		let tokenStr = await RelyingPartyRest.postChallengeReply(this.ctx, challenge, signature);
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
		let attributesData = attributes.map(attr => ({ id: attr.id, data: attr.data }));
		return RelyingPartyRest.createUser(this.ctx, attributesData, documents);
	}
}

export default RelyingPartySession;
