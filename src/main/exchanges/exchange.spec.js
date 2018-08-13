import _ from 'lodash';
import Exchange from './exchange';
import db from '../db/test-db';

describe('Exchange model', () => {
	const testItem = {
		name: 'test',
		data: {
			some: 'data',
			some2: 'data2',
			nested: { nested: 'data3' },
			array: [{ array: 1 }]
		}
	};
	const testItem2 = { ...testItem, name: `${testItem.name}2` };

	beforeEach(async () => {
		await db.reset();
	});

	it('create', async () => {
		const itm = await Exchange.create(testItem);
		const itm2 = await Exchange.create(testItem2);
		expect(itm.name).toBe(testItem.name);
		expect(itm2.name).toBe(testItem2.name);
		expect(itm.data).toEqual(testItem.data);
		expect(itm2.data).toEqual(testItem2.data);
		expect(itm).toEqual(await Exchange.query().findById(itm.name));
	});

	it('findAll', async () => {
		const itm = await Exchange.create(testItem);
		const itm2 = await Exchange.create(testItem2);
		const items = await Exchange.findAll();
		expect(items.length).toBe(2);
		expect(items).toContainEqual(itm);
		expect(items).toContainEqual(itm2);
	});

	it('import', async () => {
		await Exchange.create(testItem);
		const changedItem = { name: 'test', data: { changed: true } };
		await Exchange.import([changedItem, testItem2]);
		const all = await Exchange.query();
		const changedInDb = _.find(all, { name: 'test' });
		expect(changedInDb.data).toEqual(changedItem.data);

		const inserted = _.find(all, { name: 'test2' });

		expect(inserted.data).toEqual(testItem2.data);
	});
});
