import sinon from 'sinon';
import EventEmitter from 'events';
import fetch from 'node-fetch';
import PriceService from './price-service';
import TokenPrice from './token-price';

jest.mock('node-fetch');

const externalPrices = [
	{
		cap24hrChange: 0.14,
		long: 'Bitcoin',
		mktcap: 140646697384.71,
		perc: 0.14,
		price: 8190.33,
		shapeshift: true,
		short: 'BTC',
		supply: 17172287,
		usdVolume: 4991270000,
		volume: 4991270000,
		vwapData: 8207.767069097918,
		vwapDataBTC: 8207.767069097918
	},
	{
		cap24hrChange: 1.08,
		long: 'Ethereum',
		mktcap: 48008212572.6,
		perc: 1.08,
		price: 475.65,
		shapeshift: true,
		short: 'ETH',
		supply: 100931804,
		usdVolume: 1618940000,
		volume: 1618940000,
		vwapData: 476.65030392434795,
		vwapDataBTC: 476.65030392434795
	},
	{
		cap24hrChange: 0.63,
		long: 'XRP',
		mktcap: 18009531708.2687,
		perc: 0.63,
		price: 0.458075,
		shapeshift: false,
		short: 'XRP',
		supply: 39315683476,
		usdVolume: 212266000,
		volume: 212266000,
		vwapData: 0.4625421164150076,
		vwapDataBTC: 0.4625421164150076
	},
	{
		cap24hrChange: 0.63,
		long: 'FICTION',
		mktcap: 18009531708.2687,
		perc: 0.63,
		price: 0.458075,
		shapeshift: false,
		short: 'FIC',
		supply: 39315683476,
		usdVolume: 212266000,
		volume: 212266000,
		vwapData: 0.4625421164150076,
		vwapDataBTC: 0.4625421164150076
	}
];

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
		priceUSD: 8190.33,
		priceBTC: 1,
		priceETH: 17.21923683380637
	},
	{
		id: 2,
		name: 'Ethereum',
		symbol: 'ETH',
		source: 'https://coincap.io',
		priceUSD: 475.65,
		priceBTC: 0.058074583075407214,
		priceETH: 1
	},
	{
		id: 3,
		name: 'XRP',
		symbol: 'XRP',
		source: 'https://coincap.io',
		priceUSD: 0.458075,
		priceBTC: 0.0000559287598912376,
		priceETH: 0.0009630505623883109
	}
];

const toInsert = [
	{
		name: 'FICTION',
		priceBTC: 0.0000559287598912376,
		priceETH: 0.0009630505623883109,
		priceUSD: 0.458075,
		source: 'https://coincap.io',
		symbol: 'FIC'
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
