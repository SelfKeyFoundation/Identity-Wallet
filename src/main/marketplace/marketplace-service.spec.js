import sinon from 'sinon';
import { marketplacesOperations } from 'common/marketplaces';
import { MarketplaceService } from './marketplace-service';
import { MarketplaceTransactions } from './marketplace-transactions';

describe('MarketplaceService', () => {
	let service = null;
	let store = {
		dispatch: () => {},
		getState() {
			return this.state;
		},
		state: {}
	};
	beforeEach(() => {
		store.state = {};
		service = new MarketplaceService({ store });
	});
	afterEach(() => {
		sinon.restore();
	});

	it('loadTransactions', async () => {
		const testTransactions = [{}];
		sinon.stub(store, 'dispatch');
		sinon.stub(marketplacesOperations, 'setTransactions').returns('action');
		sinon.stub(MarketplaceTransactions, 'find').resolves(testTransactions);
		await service.loadTransactions();
		expect(
			marketplacesOperations.setTransactions.calledOnceWith(testTransactions)
		).toBeTruthy();
		expect(MarketplaceTransactions.find.calledOnce).toBeTruthy();
		expect(store.dispatch.calledOnceWith('action')).toBeTruthy();
	});
});
