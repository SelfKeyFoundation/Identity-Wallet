import sinon from 'sinon';
import _ from 'lodash';
import { setGlobalContext } from '../context';
import { exchangesSelectors } from '../exchanges';
import {
	initialState,
	marketplacesSelectors,
	marketplacesActions,
	loadTransactionsOperation,
	loadStakesOperation,
	placeStakeOperation
} from '.';
import { pricesSelectors } from '../prices';
import { ethGasStationInfoSelectors } from '../eth-gas-station';
import { fiatCurrencySelectors } from '../fiatCurrency';

describe('marketplace selectors', () => {
	let state = {};

	const testExchange = { serviceOwner: '0x0', serviceId: 'global', amount: 25, lockPeriod: 30 };
	const testService = { id: '0x0_global', ...testExchange };

	const testStake = {
		id: '0x0_global',
		serviceOwner: '0x0',
		serviceId: 'global',
		balance: 30,
		releaseDate: 30000,
		status: 'locked'
	};

	let testCurrentTransaction = {
		gasPriceEstimates: {
			avarage: 5000,
			fast: 7000,
			safeLow: 2000
		},
		gasPrice: 3000,
		gasLimit: 50000,
		amount: 25,
		action: 'placeStake',
		fiat: 'USD',
		fiatRate: 0.5,
		lockPeriod: 30,
		fee: '' + 3000 * 50000,
		feeFiat: '' + 3000 * 50000 * 0.5
	};

	beforeEach(() => {
		state = { marketplaces: { ...initialState } };
		sinon.restore();
	});
	it('servicesSelector', () => {
		sinon.stub(exchangesSelectors, 'getExchanges').returns([testExchange]);
		let services = marketplacesSelectors.servicesSelector(state);
		expect(exchangesSelectors.getExchanges.calledOnceWith(state)).toBeTruthy();
		expect(services.length).toBeGreaterThan(0);
		expect(services[0]).toEqual(testService);
	});
	it('stakeSelector', () => {
		state.marketplaces.stakesById = { [testStake.id]: testStake };
		let selectedStake = marketplacesSelectors.stakeSelector(state, testStake.id);
		expect(selectedStake).toEqual(testStake);
	});
	it('pendingTransactionSelector', () => {
		let successTx = {
			serviceOwner: '0x0',
			serviceId: 'global',
			id: 1,
			lastStatus: 'success'
		};
		let pendingTx = {
			serviceOwner: '0x1',
			serviceId: 'global',
			id: 2,
			lastStatus: 'pending'
		};
		let progressTx = {
			serviceOwner: '0x0',
			serviceId: 'global',
			id: 3,
			lastStatus: 'processing'
		};
		let errorTx = {
			serviceOwner: '0x1',
			serviceId: 'global',
			id: 4,
			lastStatus: 'error'
		};
		state.marketplaces.transactions = [1, 2, 3, 4];
		state.marketplaces.transactionsById = {
			1: successTx,
			2: pendingTx,
			3: progressTx,
			4: errorTx
		};
		let selectedTx = marketplacesSelectors.pendingTransactionSelector(state, '0x0', 'global');
		expect(selectedTx).toEqual(progressTx);
		selectedTx = marketplacesSelectors.pendingTransactionSelector(state, '0x1', 'global');
		expect(selectedTx).toEqual(pendingTx);
		selectedTx = marketplacesSelectors.pendingTransactionSelector(state, '0x2', 'global');
		expect(selectedTx).toBeNull();
	});
	it('currentTransactionSelector', () => {
		sinon.stub(ethGasStationInfoSelectors, 'getEthGasStationInfoWEI').returns({
			avarage: 5000,
			fast: 7000,
			safeLow: 2000
		});
		sinon.stub(fiatCurrencySelectors, 'getFiatCurrency').returns('USD');
		sinon.stub(pricesSelectors, 'getRate').returns(0.5);

		state.marketplaces.currentTransaction = _.pick(
			testCurrentTransaction,
			'gasPrice',
			'gasLimit',
			'amount',
			'action',
			'lockPeriod'
		);
		expect(marketplacesSelectors.currentTransactionSelector(state)).toEqual(
			testCurrentTransaction
		);
	});
	it('displayedPopupSelector', () => {
		state.marketplaces.displayedPopup = 'test';
		expect(marketplacesSelectors.displayedPopupSelector(state)).toEqual('test');
	});
	it('displayedCategorySelector', () => {
		state.marketplaces.displayedCategory = 'test';
		expect(marketplacesSelectors.displayedCategorySelector(state)).toEqual('test');
	});
});

describe('marketplace operations', () => {
	let service = {
		loadTransactions() {},
		loadStakingInfo() {},
		async placeStake() {}
	};
	let state = {};
	let store = {
		dispatch() {},
		getState() {
			return state;
		}
	};
	let services = [
		{
			id: '0x0_global',
			serviceOwner: '0x0',
			serviceId: 'global',
			amount: 25,
			lockPeriod: 30
		},
		{
			id: '0x1_global',
			serviceOwner: '0x1',
			serviceId: 'global',
			amount: 15,
			lockPeriod: 20
		}
	];
	let testAction = { type: 'test' };

	let testCurrentTransaction = {
		gasPriceEstimates: {
			avarage: 5000,
			fast: 7000,
			safeLow: 2000
		},
		gasPrice: 3000,
		gasLimit: 50000,
		amount: 25,
		action: 'placeStake',
		fiat: 'USD',
		fiatRate: 0.5,
		lockPeriod: 30,
		fee: '' + 3000 * 50000,
		feeFiat: '' + 3000 * 50000 * 0.5
	};

	beforeEach(() => {
		sinon.restore();
		setGlobalContext({ marketplacesService: service });
	});
	it('loadTransactionsOperation', async () => {
		sinon.stub(marketplacesSelectors, 'servicesSelector').returns(services);
		sinon.stub(service, 'loadTransactions').resolves('ok');
		sinon.stub(store, 'dispatch');
		sinon.stub(marketplacesActions, 'setTransactionsAction').returns(testAction);

		await loadTransactionsOperation()(store.dispatch, store.getState.bind(store));

		expect(marketplacesSelectors.servicesSelector.calledOnceWith(state)).toBeTruthy();
		expect(service.loadTransactions.calledOnceWith(services[0]));
		expect(service.loadTransactions.calledOnceWith(services[1]));
		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
	});
	it('loadStakesOperation', async () => {
		sinon.stub(marketplacesSelectors, 'servicesSelector').returns(services);
		sinon.stub(service, 'loadStakingInfo').resolves('ok');
		sinon.stub(store, 'dispatch');
		sinon.stub(marketplacesActions, 'setStakesAction').returns(testAction);

		await loadStakesOperation()(store.dispatch, store.getState.bind(store));

		expect(marketplacesSelectors.servicesSelector.calledOnceWith(state)).toBeTruthy();
		expect(service.loadStakingInfo.calledOnceWith(services[0]));
		expect(service.loadStakingInfo.calledOnceWith(services[1]));
		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
	});
	it('placeStakeOperation', async () => {
		sinon
			.stub(marketplacesSelectors, 'currentTransactionSelector')
			.returns(testCurrentTransaction);
		sinon.stub(marketplacesSelectors, 'servicesSelector').returns(services);
		sinon.stub(service, 'placeStake').resolves('ok');
		sinon.stub(store, 'dispatch');
		sinon.stub(marketplacesActions, 'addTransactionAction').returns(testAction);
		const { id, serviceId, serviceOwner, amount } = services[0];

		await placeStakeOperation(id)(store.dispatch, store.getState.bind(store));

		expect(marketplacesSelectors.currentTransactionSelector.calledOnceWith(state)).toBeTruthy();
		expect(marketplacesSelectors.servicesSelector.calledOnceWith(state)).toBeTruthy();
		expect(
			service.placeStake.calledOnceWith(
				serviceId,
				serviceOwner,
				amount,
				testCurrentTransaction.gasPrice,
				testCurrentTransaction.gasLimit
			)
		);
		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
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
	describe('displayMarketplaceCategory', () => {});
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
	describe('setMarketplaceDisplayedCategoryReducer', () => {});
	describe('clearCurrentTransactionReducer', () => {});
	describe('setCurrentTransactionReducer', () => {});
	describe('updateCurrentTransactionReducer', () => {});
});
