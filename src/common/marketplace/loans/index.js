import { inventorySelectors } from '../inventory';
// import config from 'common/config';

export const loansSelectors = {
	selectLoansInventory: (state, entityType) =>
		inventorySelectors.selectInventoryForCategory(state, 'loans', 'active', entityType)
};

export default loansSelectors;
