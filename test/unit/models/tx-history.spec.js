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

	it('findByPublicKey', async () => {
		let itm = await TxHistory.addOrUpdate(data);

		expect(itm).to.deep.eq((await TxHistory.findByPublicKey(itm.from)).data[0]);
		expect(itm).to.deep.eq((await TxHistory.findByPublicKey(itm.from.toUpperCase())).data[0]);
		expect(itm).to.deep.eq((await TxHistory.findByPublicKey(itm.to)).data[0]);
		expect(itm).to.deep.eq((await TxHistory.findByPublicKey(itm.to.toUpperCase())).data[0]);
	});

	it('findByPublicKeyAndTokenSymbol', async () => {
		let itm = await TxHistory.addOrUpdate(data);

		expect(itm).to.deep.eq(
			(await TxHistory.findByPublicKey(itm.from, itm.tokenSymbol)).data[0]
		);
		expect(itm).to.deep.eq(
			(await TxHistory.findByPublicKey(itm.from.toUpperCase(), itm.tokenSymbol)).data[0]
		);
		expect(itm).to.deep.eq((await TxHistory.findByPublicKey(itm.to, itm.tokenSymbol)).data[0]);
		expect(itm).to.deep.eq(
			(await TxHistory.findByPublicKey(itm.to.toUpperCase(), itm.tokenSymbol)).data[0]
		);

		// TODO: check doe not fetch different symbol
	});

	it('findByPublicKeyAndContractAddress', async () => {
		let itm = await TxHistory.addOrUpdate(data);

		expect(itm).to.deep.eq(
			(await TxHistory.findByPublicKey(itm.from, itm.contractAddress)).data[0]
		);
		expect(itm).to.deep.eq(
			(await TxHistory.findByPublicKey(itm.from.toUpperCase(), itm.contractAddress)).data[0]
		);
		expect(itm).to.deep.eq(
			(await TxHistory.findByPublicKey(itm.to, itm.contractAddress)).data[0]
		);
		expect(itm).to.deep.eq(
			(await TxHistory.findByPublicKey(itm.to.toUpperCase(), itm.contractAddress)).data[0]
		);

		// TODO: check doe not fetch different contract
	});
});
