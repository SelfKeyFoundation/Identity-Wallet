import sinon from 'sinon';
import Exchange from './exchange';
import fetch from 'node-fetch';
import { ExchangesService } from './exchanges-service';
jest.mock('node-fetch');
const exchanges = [
	{
		data: {
			name: 'exchange1'
		}
	},
	{
		data: {
			name: 'exchange2'
		}
	}
];

const importExchanges = [
	{
		name: 'exchange1',
		data: {
			name: 'exchange1'
		}
	},
	{
		name: 'exchange2',
		data: {
			name: 'exchange2'
		}
	}
];

describe('ExchangesService', () => {
	let service;
	beforeEach(() => {
		service = new ExchangesService();
	});
	afterEach(() => {
		sinon.restore();
		fetch.mockRestore();
	});
	it('loadExchangeData', async () => {
		fetch.mockResolvedValue({
			json() {
				return { entities: exchanges };
			}
		});
		let stub = sinon.stub(Exchange, 'import');
		await service.loadExchangeData();
		expect(stub.getCall(0).args[0]).toEqual(importExchanges);
	});
});
