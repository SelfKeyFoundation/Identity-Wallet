import { combineReducers } from 'redux';
import { inventorySelectors, inventoryOperations, reducer as inventory } from './inventory';
import { vendorSelectors, vendorOperations, reducer as vendors } from './vendors';
import { ordersSelectors, ordersOperations, reducer as orders } from './orders';
import { countriesSelectors, countriesOperations, reducer as countries } from './countries';
import { incorporationsSelectors } from './incorporations';
import { bankingSelectors } from './banking';
import { notariesSelectors } from './notaries';
import { loansSelectors } from './loans';
import { passportsSelectors } from './passports';
import {
	taxTreatiesSelectors,
	taxTreatiesOperations,
	reducer as taxTreaties
} from './tax-treaties';
import { createAliasedAction } from 'electron-redux';

export const marketplaceTypes = {
	MARKETPLACE_LOAD_OPERATION: 'marketplace/operations/LOAD'
};

export const marketplaceSelectors = {
	...inventorySelectors,
	...vendorSelectors,
	...ordersSelectors,
	...countriesSelectors,
	...taxTreatiesSelectors,
	...incorporationsSelectors,
	...bankingSelectors,
	...notariesSelectors,
	...loansSelectors,
	...passportsSelectors
};

const loadMarketplaceOperation = () => async (dispatch, getState) => {
	await Promise.all([
		dispatch(countriesOperations.loadCountriesOperation()),
		dispatch(taxTreatiesOperations.loadTaxTreatiesOperation()),
		dispatch(inventoryOperations.loadInventoryOperation()),
		dispatch(vendorOperations.loadVendorsOperation()),
		dispatch(ordersOperations.ordersLoadOperation())
	]);
};

export const marketplaceOperations = {
	...inventoryOperations,
	...vendorOperations,
	...ordersOperations,
	...countriesOperations,
	...taxTreatiesOperations,
	loadMarketplaceOperation: createAliasedAction(
		marketplaceTypes.MARKETPLACE_LOAD_OPERATION,
		loadMarketplaceOperation
	)
};

export const reducer = combineReducers({
	inventory,
	vendors,
	orders,
	countries,
	taxTreaties
});

export default reducer;
