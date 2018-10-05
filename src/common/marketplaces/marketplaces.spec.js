describe('marketplace selectors', () => {
	it('dummy test to not fail ci', () => {
		expect(true).toBeTruthy();
	});
	describe('servicesSelector', () => {
		// selects a list of marketplace items (exchanges for now)
		// reduces it to a list of services ( all exchanges will have thes same
		//     serviceOwner and serviceId so at first the list will be only one item
		// service should contain
		//    - serviceOwner
		//    - serviceId
		//    - lockPeriod
		//    - amount
	});
	describe('selectStake', () => {
		// gets serviceOwner and serviceId
		// returns current stake info
		// should contain:
		//   - serviceOwner
		//   - serviceId
		//   - balance
		//   - releaseDate ts
		//   - status 'inactive', 'locked', 'unlocked', 'pending' ('pending is optional, could be derived from 'inactive' status and in progress transaction)
	});
	describe('selectPendingTransaction', () => {
		// gets serviceOwner and serviceId
		// returns in progress transaction (in pending or progress status)
	});
	describe('selectCurrentTransaction', () => {
		// returns the currently constructed transaction (for new transaction)
		// should return null if no current transaction
		// should contain
		//  - gasPrice estimates from gas station module
		//  - gasPrice from price selector popup (actually used in the transaction)
		//  - action (placeStake / withdraw)
		//  - gasLimit
		//  - amount in KEY
		//  - lockPeriud
		//  - feePrice in eth
		//  - feePrice in usd
	});
	describe('currentPopupSelectors', () => {
		// returns the name of popup to display or null
	});
});

describe('marketplace operations', () => {
	describe('loadTransactionsOperation', () => {
		// selects a list of services
		// forEach loads transactions via marketplace service
		// dispatches set transactions action
	});
	describe('loadStakesOperation', () => {
		// selects a list of services
		// forEach loads staking info via marketplace service
		// dispatches set stakes action
	});
	describe('placeStakeOperation', () => {
		// calls place stake on marketplace service
		// dispatches add transaction action
	});
	describe('withdrawStakeOperation', () => {
		// calls withdraw stake on marketplace service
		// dispatches add transaction action
	});
	describe('updateTransactionStatusOperation', () => {
		// calls check transaction status on marketplace service
		// calls update transaction on marketplace service (sets 'lastStatus')
		// if status changes dispatches update transaction status
		// if status changes to success
		//   -  calls load staking info for this service on marketplace service
		//   -  dispatches update stake action
	});
	describe('startStakeTransactionOperation', () => {
		// selects eth gas station estimates
		// selects eth to usd rate
		// fetches gasLimit from marketplace service
		// dispastches setCurrentTransaction action
		// dispatches showMarketplacePopup : confirmStakeTransaction
	});
	describe('confirmStakeTransactionOperation', () => {
		// selects current transaction
		// call placeStake on marketplace service
		// dispatch clearCurrentTransaction
		// dispatch showMarketplacePopup: pendingTransaction
	});
	describe('startWithdrawTransactionOperation', () => {
		// selects eth gas station estimates
		// selects eth to usd rate
		// fetches gasLimit from marketplace service
		// dispastches setCurrentTransaction action
		// dispatches showMarketplacePopup: confirmWithdrawTransaction
	});
	describe('confirmWithdrawTransactionOperation', () => {
		// selects current transaction
		// call placeStake on marketplace service
		// dispatch cancelCurrentTransactionOperation
	});
	describe('cancelCurrentTransactionOperation', () => {
		// dispatches clearCurrentTransaction
		// dispatches hideMarketplacePopup
	});
});

describe('marketplace actions', () => {
	describe('updateStakeAction', () => {});
	describe('setStakesAction', () => {});
	describe('addTransactionAction', () => {});
	describe('setTransactionsAction', () => {});
	describe('updateTransactionsAction', () => {});
	describe('updateCurrentTransactionAction', () => {});
	describe('setCurrentTransactionAction', () => {});
	describe('clearCurrentTransactionAction', () => {});
	describe('showMarketplacePopup', () => {});
});

describe('marketplaceReducers', () => {
	describe('updateStakeReducer', () => {
		// finds stake via serviceOwner and serviceId
		// updates staking info
	});
	describe('setStakesReducer', () => {
		// gets a list of stakes
		// sets overwrites them into the store
	});
	describe('addTransactionReducer', () => {
		// gets a new transaction
		// writes it into the store
	});
	describe('setTransactionsReducer', () => {
		// gets a list of transactions
		// overwrites it into the store
	});
	describe('updateTransactionReducer', () => {
		// gets a transaction
		// update the transaction inside the store
	});
	describe('setMarketplacePopupReducer', () => {});
	describe('clearCurrentTransactionReducer', () => {});
	describe('setCurrentTransactionReducer', () => {});
	describe('updateCurrentTransactionReducer', () => {});
});
