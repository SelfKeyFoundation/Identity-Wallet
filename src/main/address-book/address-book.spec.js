import AddressBook from './address-book';
import TestDb from '../db/test-db';

xdescribe('Exchange model', () => {
	const testItem = {
		label: 'Jack',
		address: '0xefd32a',
		walletId: 1
	};
	const testItem2 = { ...testItem, label: `${testItem.label}2`, address: `${testItem.address}2` };

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
		const itm = await AddressBook.create(testItem);
		const itm2 = await AddressBook.create(testItem2);
		expect(itm.label).toEqual(testItem.label);
		expect(itm2.label).toEqual(testItem2.label);
		expect(itm.address).toEqual(testItem.address);
		expect(itm2.address).toEqual(testItem2.address);
		expect(itm.walletId).toEqual(testItem.walletId);
		expect(itm2.walletId).toEqual(testItem2.walletId);
		expect(itm).toEqual(await AddressBook.query().findById(itm.id));
	});

	it('findAll', async () => {
		const itm = await AddressBook.create(testItem);
		const itm2 = await AddressBook.create(testItem2);
		const items = await AddressBook.findAll();
		expect(items.length).toBe(2);
		expect(items).toContainEqual(itm);
		expect(items).toContainEqual(itm2);
	});

	it('findAllByWalletId', async () => {
		const itm = await AddressBook.create(testItem);
		const itm2 = await AddressBook.create(testItem2);
		const items = await AddressBook.findAllByWalletId(testItem.walletId);
		expect(items.length).toBe(2);
		expect(items).toContainEqual(itm);
		expect(items).toContainEqual(itm2);
	});

	it('update', async () => {
		const itm = await AddressBook.create(testItem);
		const updatedItem = await AddressBook.update({ ...testItem2, id: itm.id });
		expect(updatedItem.id).toEqual(itm.id);
		expect(updatedItem.walletId).toEqual(itm.walletId);
		expect(updatedItem.label).toEqual(testItem2.label);
		expect(updatedItem.address).toEqual(testItem2.address);
	});

	it('delete', async () => {
		const itm = await AddressBook.create(testItem);
		const itm2 = await AddressBook.create(testItem2);
		await AddressBook.delete(itm.id);
		const items = await AddressBook.findAll();
		expect(items.length).toBe(1);
		expect(items).toContainEqual(itm2);
	});
});
