const { expect } = require('chai');
const WalletSetting = require('../../../src/main/models/wallet-setting');
const db = require('../../utils/db');
describe('WalletSetting model', () => {
	const testItem = {
		walletId: 1,
		showDesktopNotifications: 1
	};
	beforeEach(async () => {
		await db.reset();
	});
	it('create', async () => {
		let all = await WalletSetting.query();
		expect(all.length).to.eq(0);
		let itm = await WalletSetting.create(testItem);
		expect(itm).to.deep.contain(testItem);
		expect(itm.id).to.be.gt(0);
		expect(itm.createdAt).to.be.gt(0);
		expect(itm.updatedAt).to.be.gt(0);
		all = await WalletSetting.query();
		expect(all.length).to.be.gt(0);
	});
	it('findByWalletId', async () => {
		let itm = await WalletSetting.create(testItem);
		expect(itm).to.deep.equal(await WalletSetting.findByWalletId(itm.walletId));
	});
	it('updateById', async () => {
		let itm = await WalletSetting.create(testItem);
		let modifiedItm = await WalletSetting.query().findById(itm.id);
		modifiedItm.showDesktopNotifications = 0;
		modifiedItm = await WalletSetting.updateById(modifiedItm.id, modifiedItm);
		expect(modifiedItm.id).to.eq(itm.id);
		expect(modifiedItm.showDesktopNotifications).to.not.eq(itm.showDesktopNotifications);
	});
});
