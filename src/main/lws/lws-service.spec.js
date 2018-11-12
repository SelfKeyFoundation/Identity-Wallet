import { LWSService, WSConnection } from './lws-service';
import { Wallet } from '../wallet/wallet';
import { IdAttribute } from '../identity/id-attribute';
import sinon from 'sinon';
import selfkey from 'selfkey.js';
import { checkPassword } from '../keystorage';

jest.mock('../keystorage');
jest.mock('node-fetch');

describe('lws-service', () => {
	const connMock = wallet => ({
		getUnlockedWallet(publicKey) {
			if (publicKey === wallet.publicKey) {
				return wallet.privateKey;
			}
			return null;
		},
		send(msg, req) {},
		unlockWallet(publicKey, privateKey) {}
	});
	describe('LWSService', () => {
		let service = null;

		beforeEach(() => {
			service = new LWSService({
				rpcHandler: { actionLogs_add() {} }
			});
		});
		afterEach(() => {
			sinon.restore();
			checkPassword.mockRestore();
		});

		describe('checkWallet', () => {
			it('returns unlocked wallet if private key found in conn', () => {
				let expected = { publicKey: 'unlocked', unlocked: true, privateKey: 'private key' };
				let wallet = service.checkWallet(expected.publicKey, connMock(expected));
				expect(wallet).toEqual(expected);
			});
			it('returns locked wallet if private key not found in conn', () => {
				let expected = { publicKey: 'locked', unlocked: false };
				let wallet = service.checkWallet(expected.publicKey, connMock(expected));
				expect(wallet).toEqual(expected);
			});
		});
		describe('reqWallets', () => {
			it('returns wallets', async () => {
				sinon.stub(Wallet, 'findAll');
				Wallet.findAll.resolves([
					{
						publicKey: 'unlocked',
						profile: 'local',
						hasSignedUpTo() {
							return true;
						}
					},
					{
						publicKey: 'locked',
						profile: 'local',
						hasSignedUpTo() {
							return true;
						}
					}
				]);

				const conn = connMock({ publicKey: 'unlocked', privateKey: 'private' });
				sinon.stub(conn, 'send');

				const msg = { type: 'test', payload: { website: { url: 'test' } } };

				await service.reqWallets(msg, conn);

				expect(
					conn.send.calledWithMatch(
						{
							payload: [
								{
									publicKey: 'unlocked',
									profile: 'local',
									unlocked: true,
									signedUp: true
								},
								{
									publicKey: 'locked',
									profile: 'local',
									unlocked: false,
									signedUp: true
								}
							]
						},
						msg
					)
				).toBeTruthy();
			});
		});
		describe('reqUnlock', () => {
			const t = (msg, wallet, expected) =>
				it(msg, async () => {
					sinon.stub(Wallet, 'findByPublicKey').resolves(wallet);
					checkPassword.mockReturnValue(wallet.privateKey);
					const conn = connMock(wallet);
					sinon.stub(conn, 'send');
					sinon.stub(conn, 'unlockWallet');
					await service.reqUnlock(
						{ payload: { publicKey: wallet.publicKey, website: { url: 'test' } } },
						conn
					);

					if (expected) {
						expect(
							conn.unlockWallet.calledWith(wallet.publicKey, wallet.privateKey)
						).toBeTruthy();
					}

					expect(
						conn.send.calledWithMatch(
							{
								payload: {
									publicKey: wallet.publicKey,
									profile: wallet.profile,
									unlocked: expected
								}
							},
							{ payload: { publicKey: wallet.publicKey, website: { url: 'test' } } }
						)
					).toBeTruthy();
				});
			t(
				'sends unlocked if password correct',
				{
					publicKey: 'unlocked',
					privateKey: 'ok',
					profile: 'local',
					hasSignedUpTo: sinon.stub().resolves(true)
				},
				true
			);
			t(
				'sends locked if password incorrect',
				{
					publicKey: 'locked',
					profile: 'local',
					hasSignedUpTo: sinon.stub().resolves(true)
				},
				false
			);
		});
		xdescribe('getAttributes', () => {
			// TODO: fix attributes json schema
			const attributes = [
				IdAttribute.fromJson({
					id: 1,
					walletId: 1,
					typeId: 1,
					data: { value: 'test' },
					documents: null
				}),
				IdAttribute.fromJson({
					id: 2,
					walletId: 1,
					typeId: 2,
					data: { value1: 'test1', value2: 'test2' },
					documents: null
				}),
				IdAttribute.fromJson({
					id: 3,
					walletId: 1,
					typeId: 3,
					data: {},
					documents: [
						{
							mimeType: 'test',
							buffer: Buffer.from('test', 'utf8'),
							size: 10,
							attributeId: 3
						}
					]
				})
			];
			beforeEach(() => {
				sinon.stub(Wallet, 'findByPublicKey').returns({
					eager: () =>
						Promise.resolve({
							idAttributes: attributes
						})
				});
			});
			it('get simple attributes', async () => {
				let retAttrs = await service.getAttributes('test', [
					{ key: 'test1', label: 'Test1' }
				]);
				expect(retAttrs).toEqual([
					{ key: 'test1', label: 'Test1', document: false, data: { value: 'test' } }
				]);
			});
			it('get missing attributes', async () => {
				let retAttrs = await service.getAttributes('test', [
					{ key: 'test1', label: 'Test1' },
					{ key: 'missing', label: 'Missing1' }
				]);
				expect(retAttrs).toEqual([
					{ key: 'test1', label: 'Test1', document: false, data: { value: 'test' } }
				]);
			});
			it('get document attributes', async () => {
				let retAttrs = await service.getAttributes('test', [
					{ key: 'test1', label: 'Test1' },
					{ key: 'test3', label: 'Test3' }
				]);
				expect(retAttrs).toEqual([
					{ key: 'test1', label: 'Test1', document: false, data: { value: 'test' } },
					{
						key: 'test3',
						label: 'Test3',
						document: true,
						data: { value: 'data:test;base64,dGVzdA==' }
					}
				]);
			});
		});
		describe('reqAttributes', () => {
			it('returns error for locked wallet', async () => {
				const wallet = { publicKey: 'locked', profile: 'local' };
				const conn = connMock(wallet);
				const resolvedAttrs = [
					{ key: 'test_key', label: 'Test Label', data: { value: 'test data' } }
				];
				sinon.stub(service, 'checkWallet').returns({ unlocked: !!wallet.privateKey });
				sinon.stub(conn, 'send');
				sinon.stub(service, 'getAttributes').resolves(resolvedAttrs);
				const msg = { payload: { ...wallet, attributes: [] } };

				await service.reqAttributes(msg, conn);

				expect(
					conn.send.calledWithMatch(
						{
							error: true,
							payload: {
								code: 'not_authorized',
								message: 'Wallet is locked, cannot request attributes'
							}
						},
						msg
					)
				).toBeTruthy();
			});

			it('returns attributes', async () => {
				const wallet = { publicKey: 'unlocked', privateKey: 'ok', profile: 'local' };
				const conn = connMock(wallet);
				const resolvedAttrs = [
					{ key: 'test_key', label: 'Test Label', data: { value: 'test data' } }
				];
				sinon.stub(service, 'checkWallet').returns({ unlocked: !!wallet.privateKey });
				sinon.stub(conn, 'send');
				sinon.stub(service, 'getAttributes').resolves(resolvedAttrs);
				const msg = { payload: { ...wallet, attributes: [] } };

				await service.reqAttributes(msg, conn);

				expect(
					conn.send.calledWithMatch(
						{
							payload: resolvedAttrs
						},
						msg
					)
				).toBeTruthy();
			});
		});

		describe('authResp', () => {
			it('sends resp via conn', async () => {
				let resp = { test: 'test resp' };
				let msg = { payload: { publicKey: 'test' } };
				let conn = { send: sinon.fake() };
				sinon
					.stub(Wallet, 'findByPublicKey')
					.resolves({ addLoginAttempt: sinon.stub().resolves({}) });
				sinon.stub(service, 'formatActionLog').returns({});
				sinon.stub(service.rpcHandler, 'actionLogs_add').resolves('ok');
				sinon.stub(service, 'formatLoginAttempt').returns({});
				await service.authResp(resp, msg, conn);
				expect(service.formatActionLog.calledOnce).toBeTruthy();
				expect(service.formatLoginAttempt.calledOnce).toBeTruthy();
				expect(service.rpcHandler.actionLogs_add.calledOnce).toBeTruthy();
				expect(conn.send.calledOnceWith(resp, msg)).toBeTruthy();
			});
		});

		describe('formatActionLog', () => {
			const wallet = { id: 1 };
			const loginAttempt = {
				websiteUrl: 'http://example.com',
				signup: false,
				errorCode: null
			};
			it('login successfull action log', () => {
				let actionLog = service.formatActionLog(wallet, loginAttempt);
				expect(actionLog).toMatchObject({
					title: `Login to ${loginAttempt.websiteUrl}`,
					content: `Login to ${loginAttempt.websiteUrl} was successful`,
					walletId: wallet.id
				});
			});
			it('login failed action log', () => {
				let actionLog = service.formatActionLog(wallet, {
					...loginAttempt,
					errorCode: true
				});
				expect(actionLog).toMatchObject({
					title: `Login to ${loginAttempt.websiteUrl}`,
					content: `Login to ${loginAttempt.websiteUrl} has failed`,
					walletId: wallet.id
				});
			});
			it('signup successfull action log', () => {
				let actionLog = service.formatActionLog(wallet, {
					...loginAttempt,
					signup: true
				});
				expect(actionLog).toMatchObject({
					title: `Signup to ${loginAttempt.websiteUrl}`,
					content: `Signup to ${loginAttempt.websiteUrl} was successful`,
					walletId: wallet.id
				});
			});
			it('signup successfull action log', () => {
				let actionLog = service.formatActionLog(wallet, {
					...loginAttempt,
					signup: true,
					errorCode: true
				});
				expect(actionLog).toMatchObject({
					title: `Signup to ${loginAttempt.websiteUrl}`,
					content: `Signup to ${loginAttempt.websiteUrl} has failed`,
					walletId: wallet.id
				});
			});
		});

		describe('formatLoginAttempt', () => {
			const website = {
				name: 'example',
				url: 'http://example.com',
				apiUrl: 'http://example.com/api'
			};
			const msg = {
				payload: {
					website,
					attributes: []
				}
			};
			const resp = {};
			it('login successfull login attempt', () => {
				expect(service.formatLoginAttempt(msg, resp)).toMatchObject({
					websiteName: website.name,
					websiteUrl: website.url,
					apiUrl: website.apiUrl,
					signup: false,
					success: true
				});
			});
			it('login failed login attempt', () => {
				expect(
					service.formatLoginAttempt(msg, {
						error: true,
						payload: { code: 'error', message: 'error' }
					})
				).toMatchObject({
					websiteName: website.name,
					websiteUrl: website.url,
					apiUrl: website.apiUrl,
					signup: false,
					success: false
				});
			});
			it('signup successfull login attempt', () => {
				expect(
					service.formatLoginAttempt(
						{ ...msg, payload: { ...msg.payload, attributes: ['test'] } },
						resp
					)
				).toMatchObject({
					websiteName: website.name,
					websiteUrl: website.url,
					apiUrl: website.apiUrl,
					signup: true,
					success: true
				});
			});
			it('signup failed login attempt', () => {
				expect(
					service.formatLoginAttempt(
						{ ...msg, payload: { ...msg.payload, attributes: ['test'] } },
						{
							error: true,
							payload: { code: 'error', message: 'error' }
						}
					)
				).toMatchObject({
					websiteName: website.name,
					websiteUrl: website.url,
					apiUrl: website.apiUrl,
					signup: true,
					success: false
				});
			});
		});

		describe('reqAuth', () => {
			it('send auth error if wallet is locked', async () => {
				const conn = {};
				const msg = { payload: { publicKey: 'test' } };
				sinon.stub(service, 'checkWallet').returns({
					unlocked: false
				});
				sinon.stub(service, 'authResp');
				await service.reqAuth(msg, conn);
				expect(
					service.authResp.calledWithMatch(
						{
							error: true,
							payload: {
								code: 'auth_error',
								message: 'Cannot auth with locked wallet'
							}
						},
						msg,
						conn
					)
				).toBeTruthy();
			});
			it('send nonce fetch error if got error from endpoint', async () => {
				const conn = {};
				const msg = { payload: { publicKey: 'test', website: {} } };
				const error = 'could note generate nonce';
				sinon.stub(service, 'authResp');
				sinon.stub(service, 'fetchNonce').resolves({ error });
				sinon.stub(service, 'checkWallet').returns({
					unlocked: true
				});
				await service.reqAuth(msg, conn);
				expect(
					service.authResp.calledWithMatch(
						{
							error: true,
							payload: {
								code: 'nonce_fetch_error',
								message: error
							}
						},
						msg,
						conn
					)
				).toBeTruthy();
			});
			it('send nonce fetch error if did not get nonce in responce json', async () => {
				const conn = {};
				const msg = { payload: { publicKey: 'test', website: {} } };
				sinon.stub(service, 'fetchNonce').resolves({});
				sinon.stub(service, 'checkWallet').returns({
					unlocked: true
				});
				sinon.stub(service, 'authResp');
				await service.reqAuth(msg, conn);
				expect(
					service.authResp.calledWithMatch(
						{
							error: true,
							payload: {
								code: 'nonce_fetch_error',
								message: 'No nonce in response'
							}
						},
						msg,
						conn
					)
				).toBeTruthy();
			});
			it('send sign error if could not generate signature', async () => {
				const conn = {};
				const msg = { payload: { publicKey: 'test', website: {} } };
				sinon.stub(service, 'fetchNonce').resolves({ nonce: 'test' });
				sinon.stub(service, 'checkWallet').returns({
					unlocked: true
				});
				sinon.stub(selfkey, 'createSignature').returns(null);
				sinon.stub(service, 'authResp');
				await service.reqAuth(msg, conn);
				expect(selfkey.createSignature.calledOnce).toBeTruthy();
				expect(
					service.authResp.calledWithMatch(
						{
							error: true,
							payload: {
								code: 'sign_error',
								message: 'Could not generate signature'
							}
						},
						msg,
						conn
					)
				).toBeTruthy();
			});
			it('send conn_error on connection error', async () => {
				const conn = {};
				const msg = { payload: { publicKey: 'test', website: {} } };
				sinon.stub(service, 'fetchNonce').throws(new Error('connection error'));
				sinon.stub(service, 'checkWallet').returns({
					unlocked: true
				});
				sinon.stub(service, 'authResp');
				await service.reqAuth(msg, conn);
				expect(
					service.authResp.calledWithMatch(
						{
							payload: {
								code: 'conn_error',
								message: 'connection error'
							},
							error: true
						},
						msg,
						conn
					)
				).toBeTruthy();
			});
			xit('fetches nonce and sends signed attributes to endpoint', async () => {});
		});

		describe('reqUnknown', () => {
			it('sends unknown request error', () => {
				const conn = { send: sinon.fake() };
				const msg = { test1: 'test1' };
				service.reqUnknown(msg, conn);
				expect(
					conn.send.calledWithMatch(
						{
							error: 'unknown request'
						},
						msg
					)
				).toBeTruthy();
			});
		});

		xdescribe('handleRequest', () => {});

		xdescribe('handleConn', () => {});

		describe('verifyClient', () => {
			const whitelistedIp = '127.0.0.1';
			const whitelistedOrigin = 'chrome-extension://knldjmfmopnpolahpmmgbagdohdnhkik';
			const notWhitelistedIp = '125.123.15.55';
			const notWhitelistedOrigin = 'chrome-extension://sdaafasdfasdasdasdsadasdasdas';

			const t = (msg, ip, origin, expected) =>
				it(msg, () => {
					let infoMock = {
						req: {
							connection: {
								remoteAddress: ip
							},
							headers: {
								origin: origin
							}
						}
					};
					expect(service.verifyClient(infoMock, expected));
				});
			t(
				'reject not whitelisted ip and not whitelisted origin',
				notWhitelistedIp,
				notWhitelistedOrigin,
				false
			);
			t(
				'reject  whitelisted ip and not whitelisted origin',
				whitelistedIp,
				notWhitelistedOrigin,
				false
			);
			t(
				'reject not whitelisted ip and whitelisted origin',
				notWhitelistedIp,
				whitelistedOrigin,
				false
			);
			t(
				'accept whitelisted ip and whitelisted origin',
				notWhitelistedIp,
				notWhitelistedOrigin,
				true
			);
		});

		xdescribe('startServer', () => {});
	});
	describe('WSConnection', () => {
		let wsconn = null;

		beforeEach(() => {
			let connMock = {
				send: sinon.fake(),
				on: sinon.fake()
			};
			let serviceMock = {
				handleSecureRequest: sinon.fake()
			};
			wsconn = new WSConnection(connMock, serviceMock, true);
		});

		afterEach(() => {
			sinon.restore();
		});

		it('unlockWallet', () => {
			const publicKey = 'public';
			const privateKey = 'private';

			expect(wsconn.getUnlockedWallet(publicKey)).toBeNull();
			wsconn.unlockWallet(publicKey, privateKey);
			expect(wsconn.getUnlockedWallet(publicKey)).toBe(privateKey);
		});
		describe('handleMessage', () => {
			it('sends error on invalalid json msg', async () => {
				sinon.stub(wsconn, 'send');
				await wsconn.handleMessage('test');

				expect(
					wsconn.send.calledWithMatch(
						{
							error: true,
							payload: { code: 'invalid_message', message: 'Invalid Message' }
						},
						{}
					)
				).toBeTruthy();
			});
			it('passes parsed messages to service', async () => {
				const msg = { type: 'test' };
				await wsconn.handleMessage(JSON.stringify(msg));
				expect(wsconn.service.handleSecureRequest.calledWithMatch(msg)).toBeTruthy();
			});
		});
		describe('send', () => {
			const t = (txt, msg, req, expected) =>
				it(txt, async () => {
					await wsconn.send(msg, req);
					expect(wsconn.conn.send.calledOnce).toBeTruthy();
					let arg = wsconn.conn.send.getCall(0).args[0];
					expect(JSON.parse(arg)).toEqual(expected);
				});
			t('adds meta with id and src', { type: 'test' }, null, {
				type: 'test',
				meta: {
					id: 'idw_0',
					src: 'idw'
				}
			});
			t(
				'reuses id and type from request',
				{ test: 1 },
				{ type: 'test', meta: { src: 'lws', id: 'lws_0' } },
				{ type: 'test', test: 1, meta: { src: 'idw', id: 'lws_0' } }
			);
			t('adds type error for errors without type', { error: true }, null, {
				error: true,
				type: 'error',
				meta: { src: 'idw', id: 'idw_0' }
			});
		});
	});
});
