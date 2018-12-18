export class RelyingPartyConfig {
	constructor(config) {
		this.config = config;
	}
	mergeWithConfig() {}
	getEndpoint() {}
	getAttributes() {}
}

export class RelyingPartyCtx {}

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
	static getChallange() {}
	static postChallangeReply() {}
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
		let signature = await this.identity.genSignatureForMessage(challange.challange);
		let tokenStr = await RelyingPartyRest.postChallangeReply(this.ctx, signature);
		let token = RelyingPartyToken.fromString(tokenStr);
		this.ctx.token = token;
		return token;
	}
}

export default RelyingPartySession;
