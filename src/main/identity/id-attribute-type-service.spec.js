import sinon from 'sinon';
import IdAttributeType from './id-attribute-type';
import fetch from 'node-fetch';
import { IdAttributeTypeService } from './id-attribute-type-service';
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

describe('IdAttributeTypeService', () => {
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
});
