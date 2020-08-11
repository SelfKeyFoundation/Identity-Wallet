import { inventorySelectors } from '../inventory';
// import config from 'common/config';

export const notariesSelectors = {
	selectNotaries: state =>
		inventorySelectors.selectInventoryForCategory(state, 'notaries').map(b => {
			return b;
		}),
	selectNotaryTypeByFilter: (state, filter) =>
		notariesSelectors.selectNotaries(state).find(filter)
};

export default notariesSelectors;
