import { LWSService, WSConnection } from './lws-service';
import { Wallet } from '../wallet/wallet';
import { IdAttribute } from '../identity/id-attribute';
import sinon from 'sinon';
import { checkPassword } from '../keystorage';

jest.mock('../keystorage');

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
			service = new LWSService();
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
						profile: 'local'
					},
					{
						publicKey: 'locked',
						profile: 'local'
					}
				]);

				const conn = connMock({ publicKey: 'unlocked', privateKey: 'private' });
				sinon.stub(conn, 'send');

				const msg = { type: 'test' };

				await service.reqWallets(msg, conn);

				expect(
					conn.send.calledWithMatch(
						{
							payload: [
								{ publicKey: 'unlocked', profile: 'local', unlocked: true },
								{ publicKey: 'locked', profile: 'local', unlocked: false }
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
					await service.reqUnlock({ payload: wallet }, conn);

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
							{ payload: wallet }
						)
					).toBeTruthy();
				});
			t(
				'sends unlocked if password correct',
				{ publicKey: 'unlocked', privateKey: 'ok', profile: 'local' },
				true
			);
			t(
				'sends locked if password incorrect',
				{ publicKey: 'locked', profile: 'local' },
				false
			);
		});
		describe('getAttributes', () => {
			const attributes = [
				IdAttribute.fromJson({
					walletId: 1,
					type: 'test1',
					data: { value: 'test' },
					documentId: null
				}),
				IdAttribute.fromJson({
					walletId: 1,
					type: 'test2',
					data: { value1: 'test1', value2: 'test2' },
					documentId: null
				}),
				IdAttribute.fromJson({
					walletId: 1,
					type: 'test3',
					data: {},
					document: { mimeType: 'test', buffer: Buffer.from('test', 'utf8') }
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

		describe('genSignature', () => {
			it('returns null if wallet is locked', () => {
				let sig = service.genSignature('test', 'test', 'asdas');
				expect(sig).toBeNull();
			});
			it('signs nonce with privateKey', async () => {
				let sig = service.genSignature(
					'12341',
					'test',
					'3a1076bf45ab87712ad64ccb3b10217737f7faacbf2872e88fdd9a537d8fe266'
				);
				expect(sig.v).toEqual(27);
				expect(sig.r.toString('hex')).toEqual(
					'693d483f13b5ade55cc0741169a3d785c9aab8aa4b64826dc964ccbd97878efb'
				);
				expect(sig.s.toString('hex')).toEqual(
					'6722b46c423932bce4824afd03f9338107577f1cb2e021064d73e7dd00c72b76'
				);
			});
			it('stringify signature', () => {
				let sig = {
					v: 2,
					s: Buffer.from('test', 'utf8'),
					r: Buffer.from('test2Î', 'utf8')
				};
				let str = service.stringifySignature(sig);
				expect(str).toEqual('{"v":2,"s":"74657374","r":"7465737432c38e"}');
			});
		});

		xdescribe('reqAuth', () => {});

		xdescribe('reqUnknown', () => {});

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
			wsconn = new WSConnection(connMock, serviceMock);
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
				expect(wsconn.service.handleRequest.calledWithMatch(msg)).toBeTruthy();
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
