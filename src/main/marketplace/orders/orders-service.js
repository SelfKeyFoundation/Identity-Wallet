import { MarketplaceOrder } from './order';

export class MarketplaceOrdersService {
	async loadOrders(identityId) {
		return MarketplaceOrder.findAll().where({ identityId });
	}

	async createOrder(order) {
		return MarketplaceOrder.create(order);
	}

	async updateOrder(order) {
		return MarketplaceOrder.updateById(order.id, order);
	}
}

export default MarketplaceOrdersService;
