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
	describe('getOrigin', () => {});
	describe('hasUserFileEndpoint', () => {
		let ctx = null;
		beforeEach(() => {
			ctx = new RelyingPartyCtx({});
		});

		it('buy default should have file endpoint', () => {
			expect(ctx.hasUserFileEndpoint()).toBe(true);
		});
		it('if file endpoint is overrided, still it should return true', () => {
			ctx.config.endpoints = { '/users/file': '/test/file/endpoint' };
			expect(ctx.hasUserFileEndpoint()).toBe(true);
		});
		it('returns false if does not have user file endpoint', () => {
			ctx.config.endpoints = { '/users/file': false };
			expect(ctx.hasUserFileEndpoint()).toBe(false);
		});
	});
});

describe('RelyingPartyRest', () => {
	let ctx = null;
	let config = null;

	beforeEach(() => {
		config = { origin: 'test', did: true };
		ctx = new RelyingPartyCtx(config, {
			publicKey: 'test',
			did: 'did:eth:0xtest',
			getDidWithParams() {
				return this.did;
			}
		});
	});
	it('getAuthorizationHeader', () => {
		let token = 'test';
		expect(RelyingPartyRest.getAuthorizationHeader(token)).toEqual(`Bearer ${token}`);
	});
	describe('getChallenge', () => {
		it('should return challenge on successfull request', async () => {
			const testEndpoint = 'http://test';
			const testChallnage = 'testChallenge';
			sinon.stub(request, 'get').resolves(testChallnage);
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.getChallenge(ctx);
			expect(ctx.getEndpoint.calledOnceWith('/auth/challenge')).toBeTruthy();
			expect(request.get.getCall(0).args).toEqual([
				{
					url: `${testEndpoint}/did:eth:0xtest`,
					headers: { 'User-Agent': RelyingPartyRest.userAgent, Origin: 'test' },
					json: true
				}
			]);
			expect(res).toBe(testChallnage);
		});
		it('should throw on call failure', () => {});
	});
	describe('postChallengeReply', () => {
		it('should return token on successfull challenge reply', async () => {
			const testEndpoint = 'http://test';
			const testToken = 'testToken';
			const testChallenge = 'test';
			const keyId = 'test';
			const testSignature = 'test sig';
			sinon.stub(request, 'post').resolves(testToken);
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.postChallengeReply(
				ctx,
				testChallenge,
				testSignature,
				keyId
			);
			expect(ctx.getEndpoint.calledOnceWith('/auth/challenge')).toBeTruthy();
			expect(request.post.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					body: { signature: { value: testSignature, keyId } },
					headers: {
						Authorization: `Bearer ${testChallenge}`,
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					json: true
				}
			]);
			expect(res).toBe(testToken);
		});
		xit('should throw 400 on bad signature', () => {});
		xit('should throw 401 on bad or missing challenge token', () => {});
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
			expect(ctx.getEndpoint.calledOnceWith('/users/token')).toBeTruthy();
			expect(res).toEqual(testUserToken);
			expect(request.get.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					headers: {
						Authorization: 'Bearer test',
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					json: true
				}
			]);
		});
		xit('should throw 404 if user does not exist', () => {});
		xit('should throw 401 on invalid or expired token', () => {});
		xit('should throw on failed request', () => {});
	});
	describe('uploadUserFile', () => {
		it('should upload user file', async () => {
			const testEndpoint = 'http://test';

			const doc = {
				id: 1,
				mimeType: 'test1',
				size: 1231,
				buffer: Buffer.from('test1'),
				name: 'test.png'
			};

			ctx.token = {
				toString() {
					return 'test';
				}
			};
			sinon.stub(request, 'post').resolves('ok');
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.uploadUserFile(ctx, doc);
			expect(res).toEqual('ok');
			expect(request.post.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					headers: {
						Authorization: 'Bearer test',
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					json: true,
					formData: {
						document: {
							value: doc.buffer,
							options: {
								contentType: doc.mimeType,
								filename: doc.name
							}
						}
					}
				}
			]);
		});
	});
	describe('createUser', () => {
		it('Should create multipart request if no file endpoint', async () => {
			const testEndpoint = 'http://test';
			let attributes = [
				{
					test1: 'test1',
					documents: [1]
				},
				{
					test2: 'test2',
					documents: [2]
				}
			];

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
			sinon.stub(ctx, 'hasUserFileEndpoint').returns(false);
			let res = await RelyingPartyRest.createUser(ctx, attributes, documents);
			expect(res).toEqual('ok');
			expect(request.post.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					headers: {
						Authorization: 'Bearer test',
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					formData: {
						attributes: {
							value: JSON.stringify([
								{
									test1: 'test1',
									documents: [1]
								},
								{
									test2: 'test2',
									documents: [2]
								}
							]),
							options: {
								contentType: 'application/json'
							}
						},
						meta: {
							value: JSON.stringify({}),
							options: {
								contentType: 'application/json'
							}
						},
						'$document-1': {
							value: documents[0].buffer,
							options: {
								contentType: documents[0].mimeType,
								filename: 'document-1',
								knownLength: documents[0].size
							}
						},
						'$document-2': {
							value: documents[1].buffer,
							options: {
								contentType: documents[1].mimeType,
								filename: 'document-2',
								knownLength: documents[1].size
							}
						}
					}
				}
			]);
		});
		it('shuld create json request if there is file endpoint', async () => {
			const testEndpoint = 'http://test';
			let attributes = [
				{
					test1: 'test1',
					documents: [1]
				},
				{
					test2: 'test2',
					documents: [2]
				}
			];

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
			sinon.stub(ctx, 'hasUserFileEndpoint').returns(true);
			let res = await RelyingPartyRest.createUser(ctx, attributes, documents);
			expect(res).toEqual('ok');
			expect(request.post.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					headers: {
						Authorization: 'Bearer test',
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					json: true,
					body: { attributes, meta: {} }
				}
			]);
		});
		xit('Should throw 400 if request was not accepted (or is invalid)', () => {});
		xit('should throw 401 if token is invalid/expired', () => {});
		xit('should throw on request failure', () => {});
	});
	describe('listKYCTemplates', () => {
		it('should return a list of KYC templates', async () => {
			const testEndpoint = 'http://test';
			ctx.token = {
				toString() {
					return 'test';
				}
			};
			sinon.stub(request, 'get').resolves('ok');
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.listKYCTemplates(ctx);
			expect(request.get.getCall(0).args).toEqual([
				{
					url: `${testEndpoint}`,
					headers: {
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					json: true
				}
			]);
			expect(res).toEqual('ok');
		});
	});
	describe('getKYCTemplate', () => {
		it('should return a KYC templates', async () => {
			const testEndpoint = 'http://test/:id';
			const id = 'template-id';
			ctx.token = {
				toString() {
					return 'test';
				}
			};
			sinon.stub(request, 'get').resolves('ok');
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.getKYCTemplate(ctx, id);
			expect(request.get.getCall(0).args).toEqual([
				{
					url: `http://test/${id}`,
					headers: {
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					json: true
				}
			]);
			expect(res).toEqual('ok');
		});
	});
	describe('createKYCApplication', () => {
		it('Should create application', async () => {
			const testEndpoint = 'http://test';
			const templateId = 1;
			const attributes = [
				{
					test1: 'test1',
					documents: [1]
				},
				{
					test2: 'test2',
					documents: [2]
				}
			];

			ctx.token = {
				toString() {
					return 'test';
				}
			};
			sinon.stub(request, 'post').resolves('ok');
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.createKYCApplication(ctx, templateId, attributes);
			expect(res).toEqual('ok');
			expect(request.post.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					headers: {
						Authorization: 'Bearer test',
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					body: { templateId, attributes },
					json: true
				}
			]);
		});
	});
	describe('updateKycApplication', () => {
		it('should update application', async () => {
			const testEndpoint = 'http://test/:id';
			const application = {
				id: 1,
				attributes: [
					{
						test1: 'test1',
						documents: [1]
					},
					{
						test2: 'test2',
						documents: [2]
					}
				]
			};

			ctx.token = {
				toString() {
					return 'test';
				}
			};
			sinon.stub(request, 'patch').resolves('ok');
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.updateKYCApplication(ctx, application);
			expect(res).toEqual('ok');
			expect(request.patch.getCall(0).args).toEqual([
				{
					url: 'http://test/1',
					headers: {
						Authorization: 'Bearer test',
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					body: application,
					json: true
				}
			]);
		});
	});
	describe('listKYCApplications', () => {
		it('should return a list of KYC applications', async () => {
			const testEndpoint = 'http://test';
			ctx.token = {
				toString() {
					return 'test';
				}
			};
			sinon.stub(request, 'get').resolves('ok');
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.listKYCApplications(ctx);
			expect(request.get.getCall(0).args).toEqual([
				{
					url: `${testEndpoint}`,
					headers: {
						Authorization: 'Bearer test',
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					json: true
				}
			]);
			expect(res).toEqual('ok');
		});
	});
	describe('getKYCApplication', () => {
		it('should return a KYC application', async () => {
			const testEndpoint = 'http://test/:id';
			const id = 'template-id';
			ctx.token = {
				toString() {
					return 'test';
				}
			};
			sinon.stub(request, 'get').resolves('ok');
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.getKYCApplication(ctx, id);
			expect(request.get.getCall(0).args).toEqual([
				{
					url: `http://test/${id}`,
					headers: {
						Authorization: 'Bearer test',
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					json: true
				}
			]);
			expect(res).toEqual('ok');
		});
	});
	describe('uploadKYCApplicationFile', () => {
		it('Should upload application file', async () => {
			const testEndpoint = 'http://test';
			const doc = { mimeType: 'test1', size: 1231, buffer: Buffer.from('test1') };
			ctx.token = {
				toString() {
					return 'test';
				}
			};
			sinon.stub(request, 'post').resolves('ok');
			sinon.stub(ctx, 'getEndpoint').returns(testEndpoint);
			let res = await RelyingPartyRest.uploadKYCApplicationFile(ctx, doc);
			expect(res).toEqual('ok');
			expect(request.post.getCall(0).args).toEqual([
				{
					url: testEndpoint,
					headers: {
						Authorization: 'Bearer test',
						'User-Agent': RelyingPartyRest.userAgent,
						Origin: 'test'
					},
					formData: {
						document: {
							value: doc.buffer,
							options: {
								contentType: doc.mimeType,
								filename: 'document'
							}
						}
					},
					json: true
				}
			]);
		});
	});
});

describe('Relying Party session', () => {
	const config = { did: true };
	const identity = {
		genSignatureForMessage() {},
		getKeyId() {
			return 'testkeyid';
		}
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
			const testChallenge = { jwt: 'challenge' };
			const testToken = { jwt: 'token' };
			const testChallengeToken = { data: { challenge: 'test' } };
			const testServiceToken = { data: 'test' };
			sinon.stub(session, 'isActive').returns(false);
			sinon.stub(RelyingPartyRest, 'getChallenge').resolves(testChallenge);
			sinon.stub(RelyingPartyRest, 'postChallengeReply').resolves(testToken);
			sinon
				.stub(RelyingPartyToken, 'fromString')
				.onCall(0)
				.returns(testChallengeToken)
				.onCall(1)
				.returns(testServiceToken);
			sinon.stub(identity, 'genSignatureForMessage').resolves(testSignature);

			let token = await session.establish();

			expect(RelyingPartyRest.getChallenge.calledOnceWith(session.ctx)).toBeTruthy();
			expect(
				identity.genSignatureForMessage.calledOnceWith(testChallengeToken.data.challenge)
			).toBeTruthy();
			expect(RelyingPartyRest.postChallengeReply.getCall(0).args).toEqual([
				session.ctx,
				testChallenge.jwt,
				testSignature,
				'testkeyid'
			]);

			expect(RelyingPartyToken.fromString.calledWith(testChallenge.jwt)).toBeTruthy();
			expect(RelyingPartyToken.fromString.calledWith(testToken.jwt)).toBeTruthy();
			expect(token).toEqual(testServiceToken);
			expect(session.ctx.token).toEqual(testServiceToken);
		});
		it('should not athenticate with rp if active', async () => {
			const testSessionToken = 'sessionToken';
			session.ctx.token = 'ACTIVE';
			sinon.stub(session, 'isActive').returns(true);

			sinon.stub(RelyingPartyRest, 'postChallengeReply').resolves(testSessionToken);

			let token = await session.establish();

			expect(RelyingPartyRest.postChallengeReply.calledOnce).toBeFalsy();

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
		it('should create user with file endpoint', async () => {
			sinon.stub(RelyingPartyRest, 'uploadUserFile').resolves({ id: 'ok' });
			sinon.stub(RelyingPartyRest, 'createUser').resolves('ok');
			sinon.stub(session.ctx, 'hasUserFileEndpoint').returns(true);

			let attributes = [
				{
					id: 1,
					schemaId: 'http://test1',
					schema: {
						type: 'object',
						properties: {
							front: { type: 'object', format: 'file' },
							back: { type: 'object', format: 'file' }
						}
					},
					data: { value: { front: '$document-1', back: '$document-2' } },
					documents: [
						{ id: 1, mimeType: 'test', size: 123, buffer: Buffer.from('test1') },
						{ id: 2, mimeType: 'test2', size: 1223, buffer: Buffer.from('test2') }
					]
				},
				{
					id: 2,
					schemaId: 'http://test2',
					data: { value: { front: '$document-3', back: '$document-4' } },
					schema: {
						type: 'object',
						properties: {
							front: { type: 'object', format: 'file' },
							back: { type: 'object', format: 'file' }
						}
					},
					documents: [
						{ id: 3, mimeType: 'test', size: 123, buffer: Buffer.from('test1') },
						{ id: 4, mimeType: 'test2', size: 1223, buffer: Buffer.from('test2') }
					]
				}
			];

			let res = await session.createUser(attributes);

			expect(RelyingPartyRest.createUser.getCall(0).args).toEqual([
				session.ctx,
				[
					{
						id: 1,
						schemaId: 'http://test1',
						schema: {
							type: 'object',
							properties: {
								front: { type: 'object', format: 'file' },
								back: { type: 'object', format: 'file' }
							}
						},
						data: {
							front: { id: 1, mimeType: 'test', size: 123, content: 'ok' },
							back: { id: 2, mimeType: 'test2', size: 1223, content: 'ok' }
						},
						documents: undefined
					},
					{
						id: 2,
						schemaId: 'http://test2',
						schema: {
							type: 'object',
							properties: {
								front: { type: 'object', format: 'file' },
								back: { type: 'object', format: 'file' }
							}
						},
						data: {
							front: { id: 3, mimeType: 'test', size: 123, content: 'ok' },
							back: { id: 4, mimeType: 'test2', size: 1223, content: 'ok' }
						},
						documents: undefined
					}
				],
				undefined,
				{}
			]);
			expect(res).toEqual('ok');
		});
		it('should create user with no file endpoint', async () => {
			sinon.stub(RelyingPartyRest, 'uploadUserFile').resolves({ id: 'ok' });
			sinon.stub(RelyingPartyRest, 'createUser').resolves('ok');
			sinon.stub(session.ctx, 'hasUserFileEndpoint').returns(false);

			const documents = [
				{ id: 1, mimeType: 'test', size: 123, buffer: Buffer.from('test1') },
				{ id: 2, mimeType: 'test2', size: 1223, buffer: Buffer.from('test2') },
				{ id: 3, mimeType: 'test', size: 123, buffer: Buffer.from('test1') },
				{ id: 4, mimeType: 'test2', size: 1223, buffer: Buffer.from('test2') }
			];

			let attributes = [
				{
					id: 1,
					schemaId: 'http://test1',
					schema: {
						type: 'object',
						properties: {
							front: { type: 'object', format: 'file' },
							back: { type: 'object', format: 'file' }
						}
					},
					data: { value: { front: '$document-1', back: '$document-2' } },
					documents: [documents[0], documents[1]]
				},
				{
					id: 2,
					schemaId: 'http://test2',
					data: { value: { front: '$document-3', back: '$document-4' } },
					schema: {
						type: 'object',
						properties: {
							front: { type: 'object', format: 'file' },
							back: { type: 'object', format: 'file' }
						}
					},
					documents: [documents[2], documents[3]]
				}
			];

			let res = await session.createUser(attributes);

			expect(RelyingPartyRest.createUser.getCall(0).args).toEqual([
				session.ctx,
				[
					{
						id: 1,
						schemaId: 'http://test1',
						schema: {
							type: 'object',
							properties: {
								front: { type: 'object', format: 'file' },
								back: { type: 'object', format: 'file' }
							}
						},
						data: {
							value: {
								front: '$document-1',
								back: '$document-2'
							}
						},
						documents: [1, 2]
					},
					{
						id: 2,
						schemaId: 'http://test2',
						schema: {
							type: 'object',
							properties: {
								front: { type: 'object', format: 'file' },
								back: { type: 'object', format: 'file' }
							}
						},
						data: {
							value: {
								front: '$document-3',
								back: '$document-4'
							}
						},
						documents: [3, 4]
					}
				],
				documents,
				{}
			]);
			expect(res).toEqual('ok');
		});
	});
	describe('listKYCTemplates', () => {});
	describe('getKYCTemplate', () => {});
	describe('createKYCApplication', () => {
		it('should create kyc application', async () => {
			sinon.stub(RelyingPartyRest, 'uploadKYCApplicationFile').resolves({ id: 'ok' });
			sinon.stub(RelyingPartyRest, 'createKYCApplication').resolves('ok');

			let attributes = [
				{
					id: 1,
					schemaId: 'http://test1',
					schema: {
						type: 'object',
						properties: {
							front: { type: 'object', format: 'file' },
							back: { type: 'object', format: 'file' }
						}
					},
					data: { value: { front: '$document-1', back: '$document-2' } },
					documents: [
						{ id: 1, mimeType: 'test', size: 123, buffer: Buffer.from('test1') },
						{ id: 2, mimeType: 'test2', size: 1223, buffer: Buffer.from('test2') }
					]
				},
				{
					id: 2,
					schemaId: 'http://test2',
					data: { value: { front: '$document-3', back: '$document-4' } },
					schema: {
						type: 'object',
						properties: {
							front: { type: 'object', format: 'file' },
							back: { type: 'object', format: 'file' }
						}
					},
					documents: [
						{ id: 3, mimeType: 'test', size: 123, buffer: Buffer.from('test1') },
						{ id: 4, mimeType: 'test2', size: 1223, buffer: Buffer.from('test2') }
					]
				}
			];

			let res = await session.createKYCApplication(1, attributes);

			expect(RelyingPartyRest.createKYCApplication.getCall(0).args).toEqual([
				session.ctx,
				1,
				[
					{
						id: 1,
						schemaId: 'http://test1',
						schema: {
							type: 'object',
							properties: {
								front: { type: 'object', format: 'file' },
								back: { type: 'object', format: 'file' }
							}
						},
						data: {
							front: { id: 1, mimeType: 'test', size: 123, content: 'ok' },
							back: { id: 2, mimeType: 'test2', size: 1223, content: 'ok' }
						},
						documents: undefined
					},
					{
						id: 2,
						schemaId: 'http://test2',
						schema: {
							type: 'object',
							properties: {
								front: { type: 'object', format: 'file' },
								back: { type: 'object', format: 'file' }
							}
						},
						data: {
							front: { id: 3, mimeType: 'test', size: 123, content: 'ok' },
							back: { id: 4, mimeType: 'test2', size: 1223, content: 'ok' }
						},
						documents: undefined
					}
				]
			]);
			expect(res).toEqual('ok');
		});
	});
	xdescribe('updateKYCApplication', () => {});
	xdescribe('listKYCApplications', () => {});
	xdescribe('getKYCApplication', () => {});
});
