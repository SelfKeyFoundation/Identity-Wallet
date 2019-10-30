import { MarketplaceTransactions } from './marketplace-transactions';
import TestDb from '../db/test-db';

describe('MarketplaceTransactions', () => {
	beforeEach(async () => {
		await TestDb.init();
	});

	afterEach(async () => {
		await TestDb.reset();
	});

	afterAll(async () => {
		await TestDb.destroy();
	});
	it('sanity', async () => {
		let tx = {
			serviceOwner: '0x000',
			serviceId: 'test',
			action: 'placeStake',
			amount: 25,
			gasPrice: 10000,
			gasLimit: 50000,
			networkId: 3,
			lastStatus: 'pending',
			blockchainTx: ['hash1', 'hash2']
		};
		let txs = await MarketplaceTransactions.query();
		expect(txs.length).toBe(0);
		let txId = await MarketplaceTransactions.query().insert(tx);
		let createdTX = await MarketplaceTransactions.query().findById(txId.$id());
		expect(createdTX).toMatchObject(tx);
		txs = await MarketplaceTransactions.query();
		expect(txs.length).toBe(1);
	});
	it('find', async () => {
		let tx = {
			serviceOwner: '0x000',
			serviceId: 'test',
			action: 'placeStake',
			amount: 25,
			gasPrice: 10000,
			gasLimit: 50000,
			networkId: 3,
			lastStatus: 'pending',
			blockchainTx: ['hash1', 'hash2']
		};
		let txId = await MarketplaceTransactions.query().insertAndFetch(tx);
		expect(await MarketplaceTransactions.find()).toEqual([txId]);
	});
});
