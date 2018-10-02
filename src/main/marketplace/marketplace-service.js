import { marketplacesOperations } from 'common/marketplaces';
import { MarketplaceTransactions } from './marketplace-transactions';

export class MarketplaceService {
	constructor({ store }) {
		this.store = store;
	}
	async loadTransactions() {
		let txs = await MarketplaceTransactions.find();
		this.store.dispatch(marketplacesOperations.setTransactions(txs));
	}
}

export default MarketplaceService;
