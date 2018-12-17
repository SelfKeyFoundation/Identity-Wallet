// import sinon from 'sinon';
import { PlatformApi, PlatformConfig } from './platform-api';

describe('PlatformConfig', () => {
	const testConfig = {};
	let cnf = null;
	beforeEach(() => {
		cnf = new PlatformConfig(testConfig);
	});
	it('config', () => {
		expect(cnf.config).toEqual(testConfig);
	});
	describe('mergeWithConfig', () => {});
	describe('getEndpoing', () => {});
	describe('getAttributes', () => {});
});

describe('PlatformRest', () => {
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

describe('platform api', () => {
	const config = {};
	let api = null;
	beforeEach(() => {
		api = new PlatformApi(config);
	});
	it('config', () => {
		expect(api.config instanceof PlatformConfig).toBeTruthy();
	});
	describe('serviceAuth', () => {
		// should get a jwt challange from RelyingPartyRest.getChallange
		// should extract challange from jwt
		// should sign the challange via private key
		// should send the jwt and  signature to RelyingPartyRest.postChallange
		// should return service auth JWT if successfull
	});
	describe('getUserToken', () => {
		// send service auth JWT to getUserToken
		// should return error if no user with publicKey
		// should return a json payload that is needed to login on the website (probably containing token)
	});
	describe('createUser', () => {
		// send user attributes and service JWT to RelyingPartyRest.createUser
	});
	describe('listKYCTemplates', () => {});
	describe('getKYCTemplate', () => {});
	describe('createKYCApplication', () => {});
	describe('listKYCApplications', () => {});
	describe('getKYCApplication', () => {});
});
