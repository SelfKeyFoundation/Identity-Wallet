import sinon from 'sinon';
import request from 'request-promise-native';
import {
	RelyingPartySession,
	RelyingPartyCtx,
	RelyingPartyRest,
	RelyingPartyToken
} from './relying-party';

afterEach(() => {
	sinon.restore();
});

describe('RelyingPartyCtx', () => {
	describe('mergeConfig', () => {});
	describe('getEndpoing', () => {});
	describe('getAttributes', () => {});
});

describe('RelyingPartyRest', () => {
	let ctx = null;
	let config = null;

	beforeEach(() => {
		config = {};
		ctx = new RelyingPartyCtx(config);
	});
	describe('getChallange', () => {
		it('should return challange on successfull request', async () => {
			const testEndpoint = 'http://test';
			const testChallnage = 'testChallange';
			sinon.stub(request, 'get').resolves(testChallnage);
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.getChallange(ctx);
			expect(ctx.getEndpoint.calledOnceWith('challange')).toBeTruthy();
			expect(request.get.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					headers: { 'User-Agent': RelyingPartyRest.userAgent }
				}
			]);
			expect(res).toBe(testChallnage);
		});
		it('should throw on call failure', () => {});
	});
	describe('postChallangeReply', () => {
		it('should return token on successfull challange reply', async () => {
			const testEndpoint = 'http://test';
			const testToken = 'testToken';
			const testChallange = 'test';
			const testSignature = 'test sig';
			sinon.stub(request, 'post').resolves(testToken);
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.postChallangeReply(ctx, testChallange, testSignature);
			expect(ctx.getEndpoint.calledOnceWith('challange')).toBeTruthy();
			expect(request.post.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					body: { signature: testSignature },
					headers: {
						Authorization: testChallange,
						'User-Agent': RelyingPartyRest.userAgent
					},
					json: true
				}
			]);
			expect(res).toBe(testToken);
		});
		xit('should throw 400 on bad signature', () => {});
		xit('should throw 401 on bad or missing challange token', () => {});
		xit('should throw error on failed request', () => {});
	});
	describe('getUserToken', () => {
		it('should return user payload if user exists', async () => {
			const testEndpoint = 'http://test';
			const testUserToken = { testUserToken: 'test' };
			sinon.stub(request, 'get').resolves(testUserToken);
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			ctx.token = {
				toString() {
					return 'test';
				}
			};
			let res = await RelyingPartyRest.getUserToken(ctx);
			expect(ctx.getEndpoint.calledOnceWith('auth/token')).toBeTruthy();
			expect(res).toEqual(testUserToken);
		});
		xit('should throw 404 if user does not exist', () => {});
		xit('should throw 401 on invalid or expired token', () => {});
		xit('should throw on failed request', () => {});
	});
	describe('createUser', () => {
		it('Should return 201 if user successfully created/updated', async () => {
			const testEndpoint = 'http://test';
			let attributes = [{ test1: 'test1' }, { test2: 'test2' }];
			let documents = [
				{ id: 1, mimeType: 'test1', size: 1231, buffer: Buffer.from('test1') },
				{ id: 2, mimeType: 'test2', size: 1111, buffer: Buffer.from('test2') }
			];
			ctx.token = {
				toString() {
					return 'test';
				}
			};
			sinon.stub(request, 'post').resolves('ok');
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.createUser(ctx, attributes, documents);
			expect(res).toEqual('ok');
			expect(request.post.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					headers: {
						Authorization: 'test',
						'User-Agent': RelyingPartyRest.userAgent
					},
					formData: {
						attributes: JSON.stringify(attributes),
						'$document-1': {
							value: documents[0].buffer,
							options: {
								contentType: documents[0].mimeType,
								fileName: null,
								knownSize: documents[0].size
							}
						},
						'$document-2': {
							value: documents[1].buffer,
							options: {
								contentType: documents[1].mimeType,
								fileName: null,
								knownSize: documents[1].size
							}
						}
					}
				}
			]);
		});
		xit('Should throw 400 if request was not accepted (or is invalid)', () => {});
		xit('should throw 401 if token is invalid/expired', () => {});
		xit('should throw on request failure', () => {});
	});
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
			const testSignature = 'testSignature';
			const testChallange = 'challange';
			const testToken = 'token';
			const testChallangeToken = { data: { challange: 'test' } };
			const testServiceToken = { data: 'test' };
			sinon.stub(session, 'isActive').returns(false);
			sinon.stub(RelyingPartyRest, 'getChallange').resolves(testChallange);
			sinon.stub(RelyingPartyRest, 'postChallangeReply').resolves(testToken);
			sinon
				.stub(RelyingPartyToken, 'fromString')
				.onCall(0)
				.returns(testChallangeToken)
				.onCall(1)
				.returns(testServiceToken);
			sinon.stub(identity, 'genSignatureForMessage').resolves(testSignature);

			let token = await session.establish();

			expect(RelyingPartyRest.getChallange.calledOnceWith(session.ctx)).toBeTruthy();
			expect(
				identity.genSignatureForMessage.calledOnceWith(testChallangeToken.data.challange)
			).toBeTruthy();
			expect(RelyingPartyRest.postChallangeReply.getCall(0).args).toEqual([
				session.ctx,
				testChallange,
				testSignature
			]);

			expect(RelyingPartyToken.fromString.calledWith(testChallange)).toBeTruthy();
			expect(RelyingPartyToken.fromString.calledWith(testToken)).toBeTruthy();
			expect(token).toEqual(testServiceToken);
			expect(session.ctx.token).toEqual(testServiceToken);
		});
		it('should not athenticate with rp if active', async () => {
			const testSessionToken = 'sessionToken';
			session.ctx.token = 'ACTIVE';
			sinon.stub(session, 'isActive').returns(true);

			sinon.stub(RelyingPartyRest, 'postChallangeReply').resolves(testSessionToken);

			let token = await session.establish();

			expect(RelyingPartyRest.postChallangeReply.calledOnce).toBeFalsy();

			expect(token).toEqual('ACTIVE');
			expect(session.ctx.token).toEqual(token);
		});
	});
	describe('getUserLoginPayload', () => {
		it('should return user payload if user exists', async () => {
			let payload = { token: 'test' };
			sinon.stub(RelyingPartyRest, 'getUserToken').resolves(payload);
			let loginPayload = await session.getUserLoginPayload();
			expect(loginPayload).toEqual(payload);
			expect(RelyingPartyRest.getUserToken.calledOnceWith(session.ctx)).toBeTruthy();
		});

		it('should throw if user does not exist', async () => {
			let payload = { error: 'true', payload: { code: '404' } };
			sinon.stub(RelyingPartyRest, 'getUserToken').throws(payload);
			try {
				await session.getUserLoginPayload();
			} catch (error) {
				expect(error).toEqual(payload);
			}
		});
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
