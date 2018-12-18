import sinon from 'sinon';
import {
	RelyingPartySession,
	RelyingPartyConfig,
	RelyingPartyCtx,
	RelyingPartyRest,
	RelyingPartyToken
} from './relying-party';

afterEach(() => {
	sinon.restore();
});

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

describe('Relying Party session', () => {
	const config = {};
	const identity = {
		genSignatureForMessage() {}
	};
	let session = null;
	beforeEach(() => {
		session = new RelyingPartySession(config, identity);
	});
	it('config', () => {
		expect(session.ctx instanceof RelyingPartyCtx).toBeTruthy();
	});
	describe('isActive', () => {
		it('false if no token', () => {
			delete session.ctx.token;
			expect(session.isActive()).toBeFalsy();
		});
		it('false if token has expired', () => {
			let token = (session.ctx.token = new RelyingPartyToken({}, {}, ''));
			sinon.stub(token, 'hasExpired').returns(true);
			expect(session.isActive()).toBeFalsy();
			expect(token.hasExpired.calledOnce).toBeTruthy();
		});
		it('true if token has not expired', () => {
			let token = (session.ctx.token = new RelyingPartyToken({}, {}, ''));
			sinon.stub(token, 'hasExpired').returns(false);
			expect(session.isActive()).toBeTruthy();
			expect(token.hasExpired.calledOnce).toBeTruthy();
		});
	});
	describe('establish', () => {
		it('should athenticate with rp if not active', async () => {
			const challange = {
				challangeToken: 'xyz',
				challange: 'test'
			};
			const testSignature = 'testSignature';
			const testSessionToken = 'sessionToken';
			sinon.stub(session, 'isActive').returns(false);
			sinon.stub(RelyingPartyRest, 'getChallange').resolves(challange);
			sinon.stub(RelyingPartyRest, 'postChallangeReply').resolves(testSessionToken);
			sinon.stub(RelyingPartyToken, 'fromString').returns('token');
			sinon.stub(identity, 'genSignatureForMessage').resolves(testSignature);

			let token = await session.establish();

			expect(RelyingPartyRest.getChallange.calledOnceWith(session.ctx)).toBeTruthy();
			expect(
				identity.genSignatureForMessage.calledOnceWith(challange.challange)
			).toBeTruthy();
			expect(
				RelyingPartyRest.postChallangeReply.calledOnceWith(session.ctx, testSignature)
			).toBeTruthy();

			expect(RelyingPartyToken.fromString.calledOnceWith(testSessionToken)).toBeTruthy();
			expect(token).toEqual('token');
			expect(session.ctx.token).toEqual(token);
		});
		it('should not athenticate with rp if active', async () => {
			const challange = {
				challangeToken: 'xyz',
				challange: 'test'
			};
			const testSignature = 'testSignature';
			const testSessionToken = 'sessionToken';
			session.ctx.token = 'ACTIVE';
			sinon.stub(session, 'isActive').returns(true);
			sinon.stub(RelyingPartyRest, 'getChallange').resolves(challange);
			sinon.stub(RelyingPartyRest, 'postChallangeReply').resolves(testSessionToken);
			sinon.stub(RelyingPartyToken, 'fromString').returns('token');
			sinon.stub(identity, 'genSignatureForMessage').resolves(testSignature);

			let token = await session.establish();

			expect(RelyingPartyRest.getChallange.calledOnceWith(session.ctx)).toBeFalsy();
			expect(identity.genSignatureForMessage.calledOnceWith(challange.challange)).toBeFalsy();
			expect(
				RelyingPartyRest.postChallangeReply.calledOnceWith(session.ctx, testSignature)
			).toBeFalsy();

			expect(RelyingPartyToken.fromString.calledOnceWith(testSessionToken)).toBeFalsy();
			expect(token).toEqual('ACTIVE');
			expect(session.ctx.token).toEqual(token);
		});
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
