import _ from 'lodash';
import ListingExchange from './listing-exchange';
import TestDb from '../db/test-db';

describe('ListingExchange model', () => {
	const testItem = {
		name: 'test',
		url: 'http://test.com',
		tradeUrl: 'http://test.com/BTC-KEY',
		region: 'Panama',
		pairs: 'ETC/BTC',
		comment: 'test comment'
	};
	const testItem2 = { ...testItem, name: `${testItem.name}2` };

	const testItem3 = { ...testItem, name: `${testItem.name}3` };

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
		const itm = await ListingExchange.create(testItem);
		const itm2 = await ListingExchange.create(testItem2);
		expect(itm.name).toBe(testItem.name);
		expect(itm2.name).toBe(testItem2.name);
		expect(itm.data).toEqual(testItem.data);
		expect(itm2.data).toEqual(testItem2.data);
		expect(itm).toEqual(await ListingExchange.query().findById(itm.name));
	});

	it('findAll', async () => {
		const itm = await ListingExchange.create(testItem);
		const itm2 = await ListingExchange.create(testItem2);
		const items = await ListingExchange.findAll();
		expect(items.length).toBe(2);
		expect(items).toContainEqual(itm);
		expect(items).toContainEqual(itm2);
	});

	it('import', async () => {
		await ListingExchange.create(testItem);
		await ListingExchange.create(testItem2);
		await ListingExchange.create(testItem3);
		const changedItem = { name: 'test', tradeUrl: 'http://test2.com/BTC-KEY' };
		await ListingExchange.import([changedItem, testItem2]);
		const all = await ListingExchange.query();
		expect(all.length).toBe(2);
		const changedInDb = _.find(all, { name: 'test' });
		expect(changedInDb.data).toEqual(changedItem.data);
		const inserted = _.find(all, { name: 'test2' });
		expect(inserted.data).toEqual(testItem2.data);
	});
});
