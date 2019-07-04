import { MarketplaceOrder } from './order';

export class MarketplaceOrdersService {
	async loadOrders(walletId) {
		return MarketplaceOrder.findAll().where({ walletId });
	}

	async createOrder(order) {
		return MarketplaceOrder.create(order);
	}

	async updateOrder(order) {
		return MarketplaceOrder.updateById(order.id, order);
	}
}

export default MarketplaceOrdersService;
