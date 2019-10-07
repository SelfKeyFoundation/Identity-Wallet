import { LWSService, WSConnection } from './lws-service';
import { Wallet } from '../wallet/wallet';
import sinon from 'sinon';
import Identity from '../platform/identity';
import RelyingPartySession from '../platform/relying-party';
import { setGlobalContext } from '../../common/context';

jest.mock('../keystorage');
jest.mock('node-fetch');

describe('lws-service', () => {
	const connMock = wallet => ({
		getIdentity(address) {
			if (address === wallet.address) {
				return wallet;
			}
			return null;
		},
		send(msg, req) {},
		addIdentity(address, identity) {}
	});
	const identity = {
		id: 1,
		did: 'test'
	};
	describe('LWSService', () => {
		let service = null;

		beforeEach(() => {
			service = new LWSService({
				rpcHandler: { actionLogs_add() {} }
			});
		});
		afterEach(() => {
			sinon.restore();
		});

		describe('reqWallets', () => {
			it('returns wallets', async () => {
				sinon.stub(Wallet, 'findAll');
				Wallet.findAll.returns({
					eager: () => [
						{
							name: 'test1',
							address: 'unlocked',
							profile: 'local',
							hasSignedUpTo() {
								return true;
							}
						},
						{
							name: 'test2',
							address: 'locked',
							profile: 'local',
							hasSignedUpTo() {
								return true;
							}
						}
					]
				});

				const conn = connMock({
					address: 'unlocked',
					privateKey: 'private',
					ident: { isSetupFinished: false }
				});
				sinon.stub(conn, 'send');

				const msg = { type: 'test', payload: { config: { website: { url: 'test' } } } };

				await service.reqWallets(msg, conn);

				expect(conn.send.getCall(0).args).toEqual([
					{
						payload: [
							{
								hasSelfkeyId: false,
								name: 'test1',
								publicKey: 'unlocked',
								profile: 'local',
								unlocked: true,
								signedUp: true
							},
							{
								name: 'test2',
								publicKey: 'locked',
								profile: 'local',
								unlocked: false,
								signedUp: false
							}
						]
					},
					msg
				]);
			});
		});

		describe('reqLedgerWallets', () => {
			it('returns wallets', async () => {
				const walletService = {
					getLedgerWallets: () => {}
				};
				setGlobalContext({ walletService });
				sinon.stub(walletService, 'getLedgerWallets').returns([{ address: 'test' }]);
				sinon.stub(Wallet, 'findByPublicKey');
				Wallet.findByPublicKey.resolves({
					address: 'test',
					profile: 'ledger',
					hasSignedUpTo() {
						return false;
					}
				});

				const conn = connMock({ address: 'unlocked', privateKey: 'private' });
				sinon.stub(conn, 'send');

				const msg = {
					type: 'test',
					payload: { config: { website: { url: 'test' }, page: 6 } }
				};

				await service.reqLedgerWallets(msg, conn);

				expect(conn.send.getCall(0).args).toEqual([
					{
						payload: [
							{
								publicKey: 'test',
								profile: 'ledger',
								unlocked: false,
								signedUp: false
							}
						]
					},
					msg
				]);
			});
		});

		describe('reqTrezorWallets', () => {
			it('returns wallets', async () => {
				const walletService = {
					getTrezorWallets: () => {}
				};
				setGlobalContext({ walletService });
				sinon.stub(walletService, 'getTrezorWallets').returns([{ address: 'test' }]);
				sinon.stub(Wallet, 'findByPublicKey');
				Wallet.findByPublicKey.resolves({
					address: 'test',
					profile: 'trezor',
					hasSignedUpTo() {
						return false;
					}
				});

				const conn = connMock({ address: 'unlocked', privateKey: 'private' });
				sinon.stub(conn, 'send');

				const msg = {
					type: 'test',
					payload: { config: { website: { url: 'test' }, page: 6 } }
				};

				await service.reqTrezorWallets(msg, conn);

				expect(conn.send.getCall(0).args).toEqual([
					{
						payload: [
							{
								publicKey: 'test',
								profile: 'trezor',
								unlocked: false,
								signedUp: false
							}
						]
					},
					msg
				]);
			});
		});

		describe('reqUnlock', () => {
			const t = (msg, profile, wallet, expected) =>
				it(msg, async () => {
					const web3Service = {
						getLedgerTransport: () => {}
					};
					setGlobalContext({ web3Service });
					const transport = {
						decorateAppAPIMethods: () => {},
						close: () => {},
						send: () => {}
					};
					sinon.stub(web3Service, 'getLedgerTransport').returns(transport);
					sinon.stub(transport, 'send').resolves('true');

					sinon.stub(Wallet, 'findByPublicKey').returns({
						eager: () => {
							return wallet;
						}
					});
					const conn = connMock(wallet);
					sinon.stub(conn, 'send');
					sinon.stub(conn, 'addIdentity');
					if (expected) {
						sinon.stub(Identity.prototype, 'unlock').resolves('ok');
					} else {
						sinon.stub(Identity.prototype, 'unlock').rejects(new Error('error'));
					}
					await service.reqUnlock(
						{
							payload: {
								publicKey: wallet.address,
								config: { website: { url: 'test' } },
								profile
							}
						},
						conn
					);

					if (expected) {
						expect(conn.addIdentity.calledOnce).toBeTruthy();
					}

					expect(
						conn.send.calledWithMatch(
							{
								payload: {
									publicKey: wallet.address,
									profile: wallet.profile,
									unlocked: expected
								}
							},
							{
								payload: {
									publicKey: wallet.address,
									config: { website: { url: 'test' } }
								}
							}
						)
					).toBeTruthy();
				});
			t(
				'sends unlocked if password correct',
				'local',
				{
					publicKey: 'unlocked',
					privateKey: 'ok',
					profile: 'local',
					hasSignedUpTo: sinon.stub().resolves(true),
					getDefaultIdentity: () => identity
				},
				true
			);
			t(
				'sends locked if password incorrect',
				'local',
				{
					publicKey: 'locked',
					profile: 'local',
					hasSignedUpTo: sinon.stub().resolves(true),
					getDefaultIdentity: () => identity
				},
				false
			);
			t(
				'sends unlocked if ledger wallet',
				'ledger',
				{
					publicKey: 'unlocked',
					profile: 'ledger',
					hasSignedUpTo: sinon.stub().resolves(true),
					path: `44'/60'/0'/0`,
					getDefaultIdentity: () => identity
				},
				true
			);
		});
		describe('reqAttributes', () => {
			it('send auth error if wallet is locked', async () => {
				const conn = {};
				const msg = { payload: { publicKey: 'test' } };
				conn.getIdentity = sinon.stub().returns(null);
				conn.send = sinon.stub().returns(null);
				await service.reqAttributes(msg, conn);
				expect(conn.send.getCall(0).args).toEqual([
					{
						error: true,
						payload: {
							code: 'not_authorized',
							message: 'Wallet is locked, cannot request attributes'
						}
					},
					msg
				]);
			});

			it('returns attributes', async () => {
				const conn = {};
				const msg = {
					payload: {
						publicKey: 'test',
						requestedAttributes: [
							'test1',
							'test2',
							{
								schemaId: 'test3',
								title: 'Test3 Title',
								id: 'test3ID',
								required: true
							}
						]
					}
				};
				let ident = { getAttributesByTypes() {} };
				sinon.stub(ident, 'getAttributesByTypes').resolves([
					{
						attributeType: { url: 'test1', content: { title: 'test1' } },
						data: { value: 1 },
						name: 'test1 name',
						documents: [],
						id: 1
					},
					{
						attributeType: { url: 'test2', content: { title: 'test2' } },
						data: { value: 2 },
						documents: [],
						id: 2
					}
				]);
				conn.getIdentity = sinon.stub().returns(ident);
				conn.send = sinon.stub().returns(null);
				await service.reqAttributes(msg, conn);
				expect(conn.send.getCall(0).args).toEqual([
					{
						payload: {
							publicKey: 'test',
							attributes: [
								{
									id: undefined,
									schemaId: 'test1',
									schema: { title: 'test1' },
									selected: 0,
									title: 'test1',
									options: [{ id: 1, name: 'test1 name', value: 1 }]
								},
								{
									id: undefined,
									schemaId: 'test2',
									selected: 0,
									schema: { title: 'test2' },
									title: 'test2',
									options: [{ id: 2, name: undefined, value: 2 }]
								},
								{
									schemaId: 'test3',
									title: 'Test3 Title',
									id: 'test3ID',
									selected: 0,
									options: null,
									schema: null,
									required: true
								}
							]
						}
					},
					msg
				]);
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
				url: 'http://example.com'
			};
			const msg = {
				payload: {
					config: { website },
					attributes: []
				}
			};
			const resp = {};
			it('login successfull login attempt', () => {
				expect(service.formatLoginAttempt(msg, resp)).toMatchObject({
					websiteName: website.name,
					websiteUrl: website.url,
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
					signup: true,
					success: false
				});
			});
		});

		describe('reqAuth', () => {
			it('send wait_hw_confirmation when profile is ledger', async () => {
				const identity = { getPublicKeyFromHardwareWallet: async () => 'test' };
				const conn = {
					send: () => {},
					getIdentity: address => identity
				};
				const msg = { payload: { publicKey: 'test', profile: 'ledger' } };
				await service.reqAuth(msg, conn);
				expect({ type: 'wait_hw_confirmation' }).toBeTruthy();
			});

			it('send auth error if wallet is locked', async () => {
				const conn = {};
				const msg = { payload: { publicKey: 'test' } };
				conn.getIdentity = sinon.stub().returns(null);
				sinon.stub(service, 'authResp');
				await service.reqAuth(msg, conn);
				expect(
					service.authResp.calledWithMatch(
						{
							error: true,
							payload: {
								code: 'not_authorized',
								message: 'Wallet is locked, cannot auth with relying party'
							}
						},
						msg,
						conn
					)
				).toBeTruthy();
			});
			it('send session_establish error if challange failed', async () => {
				const conn = { send: () => {} };
				const msg = { payload: { publicKey: 'test', config: { website: {} } } };
				const error = new Error('Session Establish Error');
				sinon.stub(RelyingPartySession.prototype, 'establish').throws(error);
				sinon.stub(service, 'authResp');
				conn.getIdentity = sinon.stub().returns({});
				await service.reqAuth(msg, conn);
				expect(
					service.authResp.calledWithMatch(
						{
							error: true,
							payload: {
								code: 'session_establish',
								message: error.message
							}
						},
						msg,
						conn
					)
				).toBeTruthy();
			});
			it('send token_error on token fetch error', async () => {
				const conn = { send: () => {} };
				const msg = {
					payload: { publicKey: 'test', config: { website: {} } }
				};
				sinon.stub(RelyingPartySession.prototype, 'establish').resolves('ok');
				conn.getIdentity = sinon.stub().returns({});
				sinon
					.stub(RelyingPartySession.prototype, 'getUserLoginPayload')
					.throws(new Error('error'));
				sinon.stub(service, 'authResp');
				await service.reqAuth(msg, conn);
				expect(service.authResp.getCall(0).args).toEqual([
					{
						payload: {
							code: 'token_error',
							message: 'User authentication failed'
						},
						error: true
					},
					msg,
					conn
				]);
			});
		});

		describe('reqSignUp', () => {
			it('send wait_hw_confirmation when profile is ledger', async () => {
				setGlobalContext({});
				const identity = { getPublicKeyFromHardwareWallet: async () => 'test' };
				const conn = {
					send: () => {},
					getIdentity: address => identity
				};
				const msg = { payload: { publicKey: 'test', profile: 'ledger' } };
				sinon.stub(conn, 'send');
				await service.reqSignup(msg, conn);
				expect({ type: 'wait_hw_confirmation' }).toBeTruthy();
			});

			it('send user create error if could not create user', async () => {
				const conn = { send: () => {} };
				const msg = {
					payload: { publicKey: 'test', attributes: [], config: { website: {} } }
				};
				sinon.stub(RelyingPartySession.prototype, 'establish').resolves('ok');
				conn.getIdentity = sinon.stub().returns({});
				sinon.stub(RelyingPartySession.prototype, 'createUser').throws(new Error('error'));
				sinon.stub(service, 'authResp');
				await service.reqSignup(msg, conn);
				expect(service.authResp.calledOnce).toBeTruthy();
				expect(service.authResp.getCall(0).args).toEqual([
					{
						error: true,
						payload: {
							code: 'user_create_error',
							message: 'error'
						}
					},
					msg,
					conn
				]);
			});
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
				handleRequest: sinon.fake()
			};
			wsconn = new WSConnection(connMock, serviceMock, true);
		});

		afterEach(() => {
			sinon.restore();
		});

		it('unlockWallet', () => {
			const address = 'public';
			const privateKey = 'private';

			expect(wsconn.getIdentity(address)).toBeNull();
			wsconn.addIdentity(address, privateKey);
			expect(wsconn.getIdentity(address)).toBe(privateKey);
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
				expect(wsconn.service.handleRequest.getCall(0).args[0]).toMatchObject(msg);
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
					id: 'idw-0',
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
				meta: { src: 'idw', id: 'idw-0' }
			});
		});
	});
});
