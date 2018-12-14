import { RelyingPartyApi, RelyingPartyConfig } from './relying-party-api';

describe('RelyingPartyConfig', () => {
	const testConfig = {};
	let cnf = null;
	beforeEach(() => {
		cnf = new RelyingPartyConfig(testConfig);
	});
	it('config', () => {
		expect(cnf.config).toEqual(testConfig);
	});
	describe('mergeWithConfig', () => {});
	describe('getEndpoing', () => {});
	describe('getAttributes', () => {});
});

describe('RelyingPartyRest', () => {
	describe('getChallange', () => {});
	describe('postChallangeReply', () => {});
	describe('getUserToken', () => {});
	describe('createUser', () => {});
	describe('listKYCTemplates', () => {});
	describe('getKYCTemplate', () => {});
	describe('createKYCApplication', () => {});
	describe('listKYCApplications', () => {});
	describe('getKYCApplication', () => {});
	describe('uploadKYCApplicationFile', () => {});
});

describe('Relying party api', () => {
	const config = {};
	let api = null;
	beforeEach(() => {
		api = new RelyingPartyApi(config);
	});
	it('config', () => {
		expect(api.config instanceof RelyingPartyConfig).toBeTruthy();
	});
	describe('serviceAuth', () => {});
	describe('getUserToken', () => {});
	describe('createUser', () => {});
	describe('listKYCTemplates', () => {});
	describe('getKYCTemplate', () => {});
	describe('createKYCApplication', () => {});
	describe('listKYCApplications', () => {});
	describe('getKYCApplication', () => {});
});
