import { MarketplaceOrder } from './order';

export class MarketplaceOrdersService {
	async loadOrders(walletId) {
		return MarketplaceOrder.findAll().where({ walletId });
	}

	async createOrder(order) {
		return MarketplaceOrder.create(order);
	}

	async updeteOrder(order) {
		return MarketplaceOrder.updateById(order);
	}
}

export default MarketplaceOrdersService;
