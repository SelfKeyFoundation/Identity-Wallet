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

export class RelyingPartyApi {
	constructor(config) {
		this.config = new RelyingPartyConfig(config);
	}
}

export class RelyingPartyConfig {
	constructor(config) {
		this.config = config;
	}
	mergeWithConfig() {}
	getEndpoint() {}
	getAttributes() {}
}

export default RelyingPartyApi;
