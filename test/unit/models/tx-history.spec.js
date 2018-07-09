// const { expect } = require('chai');
// const TxHistory = require('../../../src/main/models/tx-history');
const db = require('../../utils/db');
describe('TxHistory model', () => {
	beforeEach(async () => {
		await db.reset();
	});
	xit('findByTxHash', async () => {});

	xit('findByPublicKey', async () => {});

	xit('findByPublicKeyAndTokenSymbol', async () => {});

	xit('findByPublicKeyAndContractAddress', async () => {});
});
