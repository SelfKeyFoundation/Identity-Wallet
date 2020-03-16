import { inventorySelectors } from '../inventory';
// import config from 'common/config';

export const notariesSelectors = {
	selectNotaries: state =>
		inventorySelectors.selectInventoryForCategory(state, 'notaries').map(b => {
			console.log(b);
			return b;
		}),
	selectNotaryTypeByFilter: (state, filter) =>
		notariesSelectors.selectNotaries(state).find(filter)
	// selectNotaryJurisdictionByAccountCode: (state, accountCode) =>
	// 	notariesSelectors.selectNotaries(state).find(n => n.data.accountCode === accountCode)
};

export default notariesSelectors;
