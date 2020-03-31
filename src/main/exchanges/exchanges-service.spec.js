import sinon from 'sinon';
import Exchange from './exchange';
import ListingExchange from './listing-exchange';
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

const listingExchanges = [
	{
		data: {
			name: 'exchange1',
			url: 'http://test.com',
			trade_url: 'http://test.com/BTC-KEY',
			region: 'Singapore',
			pairs: 'BTC/ETH',
			comment: 'test exchange'
		}
	},
	{
		data: {
			name: 'exchange2',
			url: 'http://test2.com',
			trade_url: 'http://test2.com/BTC-KEY',
			region: 'PANAMA',
			pairs: 'BTC',
			comment: 'test2 exchange'
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

const importListingExchanges = [
	{
		name: 'exchange1',
		url: 'http://test.com',
		tradeUrl: 'http://test.com/BTC-KEY',
		region: 'Singapore',
		pairs: 'BTC/ETH',
		comment: 'test exchange'
	},
	{
		name: 'exchange2',
		url: 'http://test2.com',
		tradeUrl: 'http://test2.com/BTC-KEY',
		region: 'PANAMA',
		pairs: 'BTC',
		comment: 'test2 exchange'
	}
];

describe('ExchangesService', () => {
	let service;
	beforeEach(() => {
		service = new ExchangesService({ store: { dispatch: () => {} } });
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
	it('syncListingExchanges', async () => {
		fetch.mockResolvedValue({
			json() {
				return { entities: listingExchanges };
			}
		});
		let stub = sinon.stub(ListingExchange, 'import');
		await service.syncListingExchanges();
		expect(stub.getCall(0).args[0]).toEqual(importListingExchanges);
	});
});
