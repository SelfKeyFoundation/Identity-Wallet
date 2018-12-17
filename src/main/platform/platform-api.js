export class PlatformRest {
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

export class PlatformApi {
	constructor(config) {
		this.config = new PlatformConfig(config);
	}
}

export class PlatformConfig {
	constructor(config) {
		this.config = config;
	}
	mergeWithConfig() {}
	getEndpoint() {}
	getAttributes() {}
}

export default PlatformApi;
