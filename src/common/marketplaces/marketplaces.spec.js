import sinon from 'sinon';
import _ from 'lodash';
import { setGlobalContext } from '../context';
import { exchangesSelectors } from '../exchanges';
import {
	initialState,
	marketplacesSelectors,
	marketplacesActions,
	marketplacesOperations,
	marketplacesTypes,
	loadTransactionsOperation,
	withdrawStakeOperation,
	loadStakesOperation,
	placeStakeOperation,
	updateTransactionStatusOperation,
	startStakeTransactionOperation,
	startWithdrawTransactionOperation,
	confirmStakeTransactionOperation,
	confirmWithdrawTransactionOperation,
	cancelCurrentTransactionOperation,
	updateStakeReducer
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
		async withdrawStake() {},
		loadStakingInfo() {},
		async placeStake() {},
		async checkMpTxStatus() {},
		async updateTransaction() {},
		async estimateGasForStake() {},
		async estimateGasForWithdraw() {}
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

	beforeEach(() => {
		sinon.restore();
		setGlobalContext({ marketplaceService: service });
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
		let serviceOwner = '0x0';
		let serviceId = 'global';

		sinon.stub(service, 'placeStake').resolves('ok');
		sinon.stub(store, 'dispatch');
		sinon.stub(marketplacesActions, 'addTransactionAction').returns(testAction);

		await placeStakeOperation(serviceId, serviceOwner, 25, 10, 20)(
			store.dispatch,
			store.getState.bind(store)
		);

		expect(service.placeStake.calledOnceWith(serviceId, serviceOwner, 25, 10, 20)).toBeTruthy();
		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
	});
	it('withdrawStakeOperation', async () => {
		let serviceOwner = '0x0';
		let serviceId = 'global';

		sinon.stub(service, 'withdrawStake').resolves('ok');
		sinon.stub(store, 'dispatch');
		sinon.stub(marketplacesActions, 'addTransactionAction').returns(testAction);

		await withdrawStakeOperation(serviceId, serviceOwner, 10, 20)(
			store.dispatch,
			store.getState.bind(store)
		);

		expect(service.withdrawStake.calledOnceWith(serviceId, serviceOwner, 10, 20)).toBeTruthy();
		expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
	});
	describe('updateTransactionStatusOperation', async () => {
		it('if status changes calls to update transaction', async () => {
			let tx = {
				lastStatus: 'pending'
			};
			sinon.stub(service, 'checkMpTxStatus').resolves('test');
			sinon.stub(service, 'updateTransaction').resolves('ok');
			sinon.stub(marketplacesActions, 'updateTransactionAction').returns(tx);
			sinon.stub(store, 'dispatch');
			await updateTransactionStatusOperation(tx)(store.dispatch, store.getState.bind(store));

			expect(service.checkMpTxStatus.calledOnce).toBeTruthy();
			expect(service.updateTransaction.calledOnce).toBeTruthy();
			expect(marketplacesActions.updateTransactionAction.calledOnce).toBeTruthy();
			expect(store.dispatch.calledWith(tx)).toBeTruthy();
		});

		it('if status changes to success updates stake', async () => {
			let tx = {
				lastStatus: 'pending',
				serviceOwner: '0x0',
				serviceId: 'global'
			};
			let stake = { stake: 'stake' };
			sinon.stub(service, 'checkMpTxStatus').resolves('success');
			sinon.stub(service, 'loadStakingInfo').resolves(stake);
			sinon.stub(service, 'updateTransaction').resolves(tx);
			sinon.stub(marketplacesActions, 'updateStakeAction').returns('stake');
			sinon.stub(marketplacesActions, 'updateTransactionAction');
			sinon.stub(store, 'dispatch');

			await updateTransactionStatusOperation(tx)(store.dispatch, store.getState.bind(store));

			expect(
				service.loadStakingInfo.calledOnceWith(tx.serviceOwner, tx.serviceId)
			).toBeTruthy();
			expect(marketplacesActions.updateStakeAction.calledOnceWith(stake)).toBeTruthy();
			expect(store.dispatch.calledWith('stake')).toBeTruthy();
		});
	});
	it('startStakeTransactionOperation', async () => {
		let serviceOwner = '0x0';
		let serviceId = 'global';
		let amount = 25;
		sinon
			.stub(marketplacesSelectors, 'currentTransactionSelector')
			.returns({ gasPriceEstimates: { average: 50 } });
		sinon.stub(service, 'estimateGasForStake').returns({ approve: 100, deposit: 200 });
		sinon.stub(marketplacesActions, 'setCurrentTransactionAction').returns('ok');
		sinon.stub(marketplacesActions, 'showMarketplacePopupAction').returns('popup');
		sinon.stub(store, 'dispatch');

		await startStakeTransactionOperation(serviceOwner, serviceId, amount)(
			store.dispatch,
			store.getState
		);

		expect(service.estimateGasForStake.calledOnceWith(serviceOwner, serviceId)).toBeTruthy();
		expect(marketplacesActions.setCurrentTransactionAction.calledOnce).toBeTruthy();
		expect(
			marketplacesActions.showMarketplacePopupAction.calledOnceWith('confirmStakeTransaction')
		).toBeTruthy();
		expect(store.dispatch.calledWith('ok')).toBeTruthy();
		expect(store.dispatch.calledWith('popup')).toBeTruthy();
	});
	it('confirmStakeTransactionOperation', async () => {
		let tx = {
			gasPriceEstimates: { average: 50 },
			gasLimit: 100,
			gasPrice: 100,
			amount: 25,
			action: 'placeStake',
			serviceOwner: '0x0',
			serviceId: 'global'
		};
		sinon.stub(marketplacesSelectors, 'currentTransactionSelector').returns(tx);
		sinon.stub(marketplacesOperations, 'placeStake').returns('ok');
		sinon.stub(marketplacesActions, 'clearCurrentTransactionAction').returns('clear');
		sinon.stub(marketplacesActions, 'showMarketplacePopupAction').returns('popup');
		sinon.stub(store, 'dispatch');

		await confirmStakeTransactionOperation()(store.dispatch, store.getState);

		expect(marketplacesSelectors.currentTransactionSelector.calledOnce).toBeTruthy();
		expect(
			marketplacesOperations.placeStake.calledOnceWith(
				tx.serviceOwner,
				tx.serviceId,
				tx.amount,
				tx.gasPrice,
				tx.gasLimit
			)
		).toBeTruthy();
		expect(
			marketplacesActions.showMarketplacePopupAction.calledOnceWith('pendingTransaction')
		).toBeTruthy();
		expect(marketplacesActions.clearCurrentTransactionAction.calledOnce).toBeTruthy();
		expect(store.dispatch.calledWith('ok')).toBeTruthy();
		expect(store.dispatch.calledWith('clear')).toBeTruthy();
		expect(store.dispatch.calledWith('popup')).toBeTruthy();
	});
	it('startWithdrawTransactionOperation', async () => {
		let serviceOwner = '0x0';
		let serviceId = 'global';
		sinon
			.stub(marketplacesSelectors, 'currentTransactionSelector')
			.returns({ gasPriceEstimates: { average: 50 } });
		sinon.stub(service, 'estimateGasForWithdraw').returns(30);
		sinon.stub(marketplacesActions, 'setCurrentTransactionAction').returns('ok');
		sinon.stub(marketplacesActions, 'showMarketplacePopupAction').returns('popup');
		sinon.stub(store, 'dispatch');

		await startWithdrawTransactionOperation(serviceOwner, serviceId)(
			store.dispatch,
			store.getState
		);

		expect(service.estimateGasForWithdraw.calledOnceWith(serviceOwner, serviceId)).toBeTruthy();
		expect(marketplacesActions.setCurrentTransactionAction.calledOnce).toBeTruthy();
		expect(
			marketplacesActions.showMarketplacePopupAction.calledOnceWith(
				'confirmWithdrawTransaction'
			)
		).toBeTruthy();
		expect(store.dispatch.calledWith('ok')).toBeTruthy();
		expect(store.dispatch.calledWith('popup')).toBeTruthy();
	});
	it('confirmWithdrawTransactionOperation', async () => {
		let tx = {
			gasPriceEstimates: { average: 50 },
			gasLimit: 100,
			gasPrice: 100,
			action: 'withdrawStake',
			serviceOwner: '0x0',
			serviceId: 'global'
		};
		sinon.stub(marketplacesSelectors, 'currentTransactionSelector').returns(tx);
		sinon.stub(marketplacesOperations, 'withdrawStake').returns('ok');
		sinon.stub(marketplacesActions, 'clearCurrentTransactionAction').returns('clear');
		sinon.stub(marketplacesActions, 'showMarketplacePopupAction').returns('popup');
		sinon.stub(store, 'dispatch');

		await confirmWithdrawTransactionOperation()(store.dispatch, store.getState);

		expect(marketplacesSelectors.currentTransactionSelector.calledOnce).toBeTruthy();
		expect(
			marketplacesOperations.withdrawStake.calledOnceWith(
				tx.serviceOwner,
				tx.serviceId,
				tx.gasPrice,
				tx.gasLimit
			)
		).toBeTruthy();
		expect(
			marketplacesActions.showMarketplacePopupAction.calledOnceWith('pendingTransaction')
		).toBeTruthy();
		expect(marketplacesActions.clearCurrentTransactionAction.calledOnce).toBeTruthy();
		expect(store.dispatch.calledWith('ok')).toBeTruthy();
		expect(store.dispatch.calledWith('clear')).toBeTruthy();
		expect(store.dispatch.calledWith('popup')).toBeTruthy();
	});
	it('cancelCurrentTransactionOperation', async () => {
		sinon.stub(marketplacesActions, 'clearCurrentTransactionAction').returns('clear');
		sinon.stub(marketplacesActions, 'showMarketplacePopupAction').returns('hide');
		sinon.stub(store, 'dispatch');

		await cancelCurrentTransactionOperation()(store.dispatch, store.getState);
		expect(marketplacesActions.clearCurrentTransactionAction.calledOnce).toBeTruthy();
		expect(marketplacesActions.showMarketplacePopupAction.calledOnceWith(null)).toBeTruthy();
		expect(store.dispatch.calledWith('clear')).toBeTruthy();
		expect(store.dispatch.calledWith('hide')).toBeTruthy();
	});
});

describe('marketplace actions', () => {
	beforeEach(() => {
		sinon.restore();
	});
	it('updateStakeAction', () => {
		let stake = { test: 'test' };
		expect(marketplacesActions.updateStakeAction(stake)).toEqual({
			type: marketplacesTypes.MARKETPLACE_STAKES_UPDATE_ONE,
			payload: stake
		});
	});
	it('setStakesAction', () => {
		let stakes = [{ test: 'test' }];
		expect(marketplacesActions.setStakesAction(stakes)).toEqual({
			type: marketplacesTypes.MARKETPLACE_STAKES_SET,
			payload: stakes
		});
	});
	it('addTransactionAction', () => {
		let tx = { test: 'test' };
		expect(marketplacesActions.addTransactionAction(tx)).toEqual({
			type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_ADD,
			payload: tx
		});
	});
	it('setTransactionsAction', () => {
		let txs = { test: 'test' };
		expect(marketplacesActions.setTransactionsAction(txs)).toEqual({
			type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_SET,
			payload: txs
		});
	});
	it('updateTransactionAction', () => {
		let tx = { test: 'test' };
		expect(marketplacesActions.updateTransactionAction(tx)).toEqual({
			type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_UPDATE_ONE,
			payload: tx
		});
	});
	it('updateCurrentTransactionAction', () => {
		let tx = { test: 'test' };
		expect(marketplacesActions.updateCurrentTransactionAction(tx)).toEqual({
			type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_UPDATE,
			payload: tx
		});
	});
	it('setCurrentTransactionAction', () => {
		let tx = { test: 'test' };
		expect(marketplacesActions.setCurrentTransactionAction(tx)).toEqual({
			type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_SET,
			payload: tx
		});
	});
	it('clearCurrentTransactionAction', () => {
		expect(marketplacesActions.clearCurrentTransactionAction()).toEqual({
			type: marketplacesTypes.MARKETPLACE_TRANSACTIONS_CURRENT_CLEAR
		});
	});
	it('showMarketplacePopupAction', () => {
		let popup = 'test-popup';
		expect(marketplacesActions.showMarketplacePopupAction(popup)).toEqual({
			type: marketplacesTypes.MARKETPLACE_POPUP_SHOW,
			payload: popup
		});
	});
	it('displayMarketplaceStateAction', () => {
		let state = 'test-popup';
		expect(marketplacesActions.displayMarketplaceStateAction(state)).toEqual({
			type: marketplacesTypes.MARKETPLACE_STATE_SHOW,
			payload: state
		});
	});
});

describe('marketplaceReducers', () => {
	describe('updateStakeReducer', () => {
		let oldStake = { id: '0x0_global' };
		let newStake = { serviceOwner: '0x0', serviceId: 'global', test: 'test1' };
		let state = {
			stakes: [oldStake.id],
			stakesById: { [oldStake.id]: oldStake }
		};
		let newState = updateStakeReducer(state, marketplacesActions.updateStakeAction(newStake));

		expect(newState).toEqual({
			stakes: [oldStake.id],
			stakesById: {
				[oldStake.id]: {
					id: '0x0_global',
					serviceOwner: '0x0',
					serviceId: 'global',
					test: 'test1'
				}
			}
		});
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
