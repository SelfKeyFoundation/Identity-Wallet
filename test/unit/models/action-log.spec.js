const { expect } = require('chai');
const ActionLog = require('../../../src/main/models/action-log');
const db = require('../../utils/db');
describe('ActionLog model', () => {
	const testLog = { walletId: 10, title: 'test', content: 'test content' };
	beforeEach(async () => {
		await db.reset();
	});
	it('create', async () => {
		const log = await ActionLog.create(testLog);
		expect(log).to.contain(testLog);
		expect(log.createdAt).to.exist;
		expect(log.updatedAt).to.exist;
	});
	it('findByWalletId', async () => {
		await ActionLog.query().insert(testLog);
		await ActionLog.query().insert(testLog);
		const logs = await ActionLog.findByWalletId(testLog.walletId);
		expect(logs.length).to.be.eq(2);
		const log = logs[0];
		expect(log.walletId).to.equal(testLog.walletId);
		expect(log.title).to.equal(testLog.title);
		expect(log.content).to.equal(testLog.content);
	});
});
