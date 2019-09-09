import { MarketplaceOrder } from './order';

export class MarketplaceOrdersService {
	async loadOrders(identityIdId) {
		return MarketplaceOrder.findAll().where({ identityIdId });
	}

	async createOrder(order) {
		return MarketplaceOrder.create(order);
	}

	async updateOrder(order) {
		return MarketplaceOrder.updateById(order.id, order);
	}
}

export default MarketplaceOrdersService;
