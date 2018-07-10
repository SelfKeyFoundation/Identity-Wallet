const { expect } = require('chai');
const TxHistory = require('../../../src/main/models/tx-history');
const db = require('../../utils/db');
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
		await db.reset();
	});

	it('addOrUpdate', async () => {
		let all = await TxHistory.query();
		expect(all.length).to.eq(0);
		let itm = await TxHistory.addOrUpdate(data);
		expect(itm.id).to.be.gt(0);
		expect(itm.hash).to.eq(data.hash);
		const updated = { ...data, blockHash: 'modified' };
		let modifiedItm = await TxHistory.addOrUpdate(updated);
		expect(modifiedItm.id).to.eq(itm.id);
		expect(modifiedItm.blockHash).to.not.eq(itm.blockHash);
	});

	xit('findByPublicKey', async () => {});

	xit('findByPublicKeyAndTokenSymbol', async () => {});

	xit('findByPublicKeyAndContractAddress', async () => {});
});
