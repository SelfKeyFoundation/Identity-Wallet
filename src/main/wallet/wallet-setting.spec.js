import WalletSetting from './wallet-setting';
import TestDb from '../db/test-db';

describe('WalletSetting model', () => {
	const testItem = {
		walletId: 1,
		showDesktopNotifications: 1,
		moonPayTermsAccepted: true,
		moonPayLogin: 'test@test.com',
		moonPayPreviousAuth: true
	};
	beforeEach(async () => {
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});
	it('create', async () => {
		let all = await WalletSetting.query();
		expect(all.length).toBe(0);
		let itm = await WalletSetting.create(testItem);
		expect(itm).toMatchObject(testItem);
		expect(itm.id).toBeGreaterThan(0);
		expect(itm.createdAt).toBeGreaterThan(0);
		expect(itm.updatedAt).toBeGreaterThan(0);
		all = await WalletSetting.query();
		expect(all.length).toBeGreaterThan(0);
	});
	it('findByWalletId', async () => {
		let itm = await WalletSetting.create(testItem);
		expect(itm).toEqual(await WalletSetting.findByWalletId(itm.walletId));
	});
	it('updateById', async () => {
		let itm = await WalletSetting.create(testItem);
		let modifiedItm = await WalletSetting.query().findById(itm.id);
		modifiedItm.showDesktopNotifications = 0;
		modifiedItm = await WalletSetting.updateById(modifiedItm.id, modifiedItm);
		expect(modifiedItm.id).toBe(itm.id);
		expect(modifiedItm.showDesktopNotifications).not.toBe(itm.showDesktopNotifications);
	});
});
