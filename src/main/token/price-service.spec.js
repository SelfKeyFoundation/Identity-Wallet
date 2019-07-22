import sinon from 'sinon';
import EventEmitter from 'events';
import fetch from 'node-fetch';
import PriceService from './price-service';
import TokenPrice from './token-price';

jest.mock('node-fetch');

const externalPrices = {
	data: [
		{
			id: 'bitcoin',
			rank: '1',
			symbol: 'BTC',
			name: 'Bitcoin',
			supply: '17831725.0000000000000000',
			maxSupply: '21000000.0000000000000000',
			marketCapUsd: '188260079253.6764766978269150',
			volumeUsd24Hr: '5587065426.9568660669235578',
			priceUsd: '10557.5921148221205014',
			changePercent24Hr: '-1.3681762143450001',
			vwap24Hr: '10530.6728168159343312'
		},
		{
			id: 'ethereum',
			rank: '2',
			symbol: 'ETH',
			name: 'Ethereum',
			supply: '107003311.8115000000000000',
			maxSupply: null,
			marketCapUsd: '23874914562.8705103300358363',
			volumeUsd24Hr: '2080337759.5286681344922608',
			priceUsd: '223.1231366458004738',
			changePercent24Hr: '2.2490618648431541',
			vwap24Hr: '223.3830415846096125'
		},
		{
			id: 'ripple',
			rank: '3',
			symbol: 'XRP',
			name: 'XRP',
			supply: '42832704971.0000000000000000',
			maxSupply: '100000000000.0000000000000000',
			marketCapUsd: '13953109840.5378012077011001',
			volumeUsd24Hr: '332513663.0208197194091264',
			priceUsd: '0.3257583159873931',
			changePercent24Hr: '1.4582270815337984',
			vwap24Hr: '0.3272723262373986'
		},
		{
			id: 'fiction',
			rank: '320',
			symbol: 'FIC',
			name: 'FICTION',
			supply: '39315683476',
			maxSupply: '100000000000.0000000000000000',
			marketCapUsd: '18009531708.2687',
			volumeUsd24Hr: '212266000',
			priceUsd: '0.458075',
			changePercent24Hr: '2.4582270815337984',
			vwap24Hr: '0.4625421164150076'
		},
		{
			id: 'key',
			rank: '400',
			symbol: 'KEY',
			name: 'KEY',
			supply: '42832704971.0000000000000000',
			maxSupply: '100000000000.0000000000000000',
			marketCapUsd: '13953109840.5378012077011001',
			volumeUsd24Hr: '332513663.0208197194091264',
			priceUsd: '0.3257583159873931',
			changePercent24Hr: '1.4582270815337984',
			vwap24Hr: '0.3272723262373986'
		}
	]
};

const existingPrices = [
	{ id: 1, symbol: 'BTC', name: 'Bitcoin' },
	{ id: 2, symbol: 'ETH', name: 'Ethereum' },
	{ id: 3, symbol: 'XRP', name: 'XRP' }
];

const toUpdate = [
	{
		id: 1,
		name: 'Bitcoin',
		symbol: 'BTC',
		source: 'https://coincap.io',
		priceUSD: 10557.5921148221205014,
		priceBTC: 1,
		priceETH: 47.317334605159736
	},
	{
		id: 2,
		name: 'Ethereum',
		symbol: 'ETH',
		source: 'https://coincap.io',
		priceUSD: 223.12313664580049,
		priceBTC: 0.021133903850343982,
		priceETH: 1
	},
	{
		id: 3,
		name: 'XRP',
		symbol: 'XRP',
		source: 'https://coincap.io',
		priceUSD: 0.3257583159873931,
		priceBTC: 0.000030855360999413036,
		priceETH: 0.0014599934407722227
	}
];

const toInsert = [
	{
		name: 'FICTION',
		priceBTC: 0.00004338820774832689,
		priceETH: 0.002053014343945768,
		priceUSD: 0.458075,
		source: 'https://coincap.io',
		symbol: 'FIC'
	},
	{
		name: 'KEY',
		priceBTC: 0.000030855360999413036,
		priceETH: 0.0014599934407722227,
		priceUSD: 0.3257583159873931,
		source: 'https://coincap.io',
		symbol: 'KEY'
	}
];

describe('PriceService', () => {
	afterEach(() => {
		sinon.restore();
	});
	it('is event emmitter', () => {
		const priceService = new PriceService();
		expect(priceService instanceof EventEmitter).toBeTruthy();
	});
	it('loadPriceData', async () => {
		const priceService = new PriceService();
		let addStub = sinon.stub(TokenPrice, 'bulkAdd').resolves();
		let editStub = sinon.stub(TokenPrice, 'bulkEdit').resolves();
		sinon.stub(TokenPrice, 'findAll').resolves(existingPrices);
		fetch.mockResolvedValue({
			json() {
				return externalPrices;
			}
		});
		await priceService.loadPriceData();
		expect(editStub.getCall(0).args).toEqual([toUpdate]);
		expect(addStub.getCall(0).args).toEqual([toInsert]);
	});
	it('startUpdateData', async () => {
		const priceService = new PriceService();
		const loadStub = sinon.stub(PriceService.prototype, 'loadPriceData');
		priceService.startUpdateData();
		expect(loadStub.calledOnce).toBeTruthy();
	});
});
