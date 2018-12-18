import request from 'request-promise-native';
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
	hasExpired() {}
}

export class RelyingPartyRest {
	static getChallange(ctx) {
		let url = ctx.getEndpoint('challange');
		return request.get(url);
	}
	static postChallangeReply(ctx, challange, signature) {
		let url = ctx.getEndpoint('challange');
		return request.post({
			url,
			body: { signature },
			headers: { Authorization: challange },
			json: true
		});
	}
	static getUserToken() {}
	static createUser() {}
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
}

export default RelyingPartySession;
