import ContractAllowance from './contract-allowance';
import TestDb from '../../db/test-db';

describe('ContractAllowance model', () => {
	const testItem = {
		contractAddress: 'testC',
		tokenAddress: 'testT',
		walletId: 1
	};
	const testItem2 = {
		contractAddress: 'testC2',
		tokenAddress: 'testT2',
		walletId: 1
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
		let contract = await ContractAllowance.create(testItem);
		expect(contract.id).toBeGreaterThan(0);
		expect(contract.createdAt).toBeGreaterThan(0);
		expect(contract.updatedAt).toBeGreaterThan(0);
		expect(contract.env).toBe('test');
	});

	it('findAll', async () => {
		let all = await ContractAllowance.findAll();
		expect(all.length).toBe(0);
		await ContractAllowance.create(testItem);
		await ContractAllowance.create(testItem2);
		all = await ContractAllowance.findAll();
		expect(all.length).toBe(2);
	});

	it('updateById', async () => {
		let itm = await ContractAllowance.create(testItem);
		let updated = await ContractAllowance.updateById(itm.id, {
			contractAddress: 'Updated contract address'
		});
		let found = await ContractAllowance.query().findById(itm.id);
		expect(updated).toEqual(found);
		expect(updated).not.toMatchObject(itm);
	});
});
