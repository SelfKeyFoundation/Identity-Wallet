import TxHistory from './tx-history';
import TestDb from '../db/test-db';

describe('TxHistory model', () => {
	const data = {
		hash: 'abc',
		blockNumber: 12,
		timeStamp: Date.now(),
		nonce: 1,
		blockHash: 'cba',
		contractAddress: 'bca',
		from: 'from',
		to: 'to',
		value: 10,
		tokenName: 'Etherium',
		tokenSymbol: 'ETH',
		tokenDecimal: 10,
		transactionIndex: 1,
		gas: 2,
		gasPrice: 1,
		cumulativeGasUsed: 3,
		gasUsed: 2,
		input: 'testInput',
		confirmation: 'testConfirmation',
		isError: 0,
		txReceiptStatus: 1,
		networkId: 1
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

	it('addOrUpdate', async () => {
		let all = await TxHistory.query();
		expect(all.length).toBe(0);
		let itm = await TxHistory.addOrUpdate(data);
		expect(itm.id).toBeGreaterThan(0);
		expect(itm.hash).toBe(data.hash);
		const updated = { ...data, blockHash: 'modified' };
		let modifiedItm = await TxHistory.addOrUpdate(updated);
		expect(modifiedItm.id).toBe(itm.id);
		expect(modifiedItm.blockHash).not.toBe(itm.blockHash);
	});

	it('findByAddress', async () => {
		let itm = await TxHistory.addOrUpdate(data);
		expect(itm).toEqual((await TxHistory.findByAddress(itm.from))[0]);
		expect(itm).toEqual((await TxHistory.findByAddress(itm.from.toUpperCase()))[0]);
		expect(itm).toEqual((await TxHistory.findByAddress(itm.to))[0]);
		expect(itm).toEqual((await TxHistory.findByAddress(itm.to.toUpperCase()))[0]);
	});

	it('findByAddressAndTokenSymbol', async () => {
		let itm = await TxHistory.addOrUpdate(data);

		expect(itm).toEqual((await TxHistory.findByAddress(itm.from, itm.tokenSymbol))[0]);
		expect(itm).toEqual(
			(await TxHistory.findByAddress(itm.from.toUpperCase(), itm.tokenSymbol))[0]
		);
		expect(itm).toEqual((await TxHistory.findByAddress(itm.to, itm.tokenSymbol))[0]);
		expect(itm).toEqual(
			(await TxHistory.findByAddress(itm.to.toUpperCase(), itm.tokenSymbol))[0]
		);

		// TODO: check doe not fetch different symbol
	});

	it('findByAddressAndContractAddress', async () => {
		let itm = await TxHistory.addOrUpdate(data);

		expect(itm).toEqual((await TxHistory.findByAddress(itm.from, itm.contractAddress))[0]);
		expect(itm).toEqual(
			(await TxHistory.findByAddress(itm.from.toUpperCase(), itm.contractAddress))[0]
		);
		expect(itm).toEqual((await TxHistory.findByAddress(itm.to, itm.contractAddress))[0]);
		expect(itm).toEqual(
			(await TxHistory.findByAddress(itm.to.toUpperCase(), itm.contractAddress))[0]
		);

		// TODO: check doe not fetch different contract
	});
});
