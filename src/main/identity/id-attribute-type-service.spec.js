import sinon from 'sinon';
import IdAttributeType from './id-attribute-type';
import fetch from 'node-fetch';
import { IdAttributeTypeService, JSON_SCHEMA_URL } from './id-attribute-type-service';

jest.mock('node-fetch');
const idAttributesTypes = [
	{
		data: {
			fields: {
				name: 'exchange1'
			}
		}
	},
	{
		data: {
			fields: {
				name: 'exchange2'
			}
		}
	}
];

const importIdAttributeTypes = [
	{
		name: 'exchange1'
	},
	{
		name: 'exchange2'
	}
];

xdescribe('IdAttributeTypeService', () => {
	let service;
	beforeEach(() => {
		service = new IdAttributeTypeService();
	});
	afterEach(() => {
		sinon.restore();
		fetch.mockRestore();
	});
	it('loadIdAttributeTypes', async () => {
		fetch.mockResolvedValue({
			json() {
				return { ID_Attributes: idAttributesTypes };
			}
		});
		let stub = sinon.stub(IdAttributeType, 'import');
		await service.loadIdAttributeTypes();
		expect(stub.getCall(0).args[0]).toEqual(importIdAttributeTypes);
	});
	it('resolveSchemas', async () => {
		let stub = sinon.stub(IdAttributeTypeService.prototype, 'resolveSchema');
		let modelStub = sinon.stub(IdAttributeType, 'findAll');
		modelStub.returns({
			eager: async () => [
				{
					schema: {
						hasExpired: () => true
					}
				},
				{
					schema: {
						hasExpired: () => true
					}
				},
				{
					schema: {
						hasExpired: () => false
					}
				},
				{}
			]
		});
		await service.resolveSchemas();
		expect(stub.getCalls().length).toBe(2);
	});
	xit('resolveSchema', () => {});
	it('getSchemaUrl', () => {
		let url;
		url = service.getSchemaUrl('test_data', { jsonSchemaUrl: 'test' });
		expect(url).toBe('test');
		url = service.getSchemaUrl('test_data_key', {});
		expect(url).toBe(`${JSON_SCHEMA_URL}/test-data-key.json`);
		url = service.getSchemaUrl('test_data_key');
		expect(url).toBe(`${JSON_SCHEMA_URL}/test-data-key.json`);
	});
});
