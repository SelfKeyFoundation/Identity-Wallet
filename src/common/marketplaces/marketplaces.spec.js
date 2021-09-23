import sinon from 'sinon';
import _ from 'lodash';
import { setGlobalContext } from '../context';
import { exchangesSelectors } from '../exchanges';
import reducer, {
	initialState,
	marketplacesSelectors,
	marketplacesActions,
	marketplacesOperations,
	marketplacesTypes,
	reducers
} from '.';
import {
	loadTransactionsOperation,
	withdrawStakeOperation,
	loadStakesOperation,
	placeStakeOperation,
	updateTransactionStatusOperation,
	startStakeTransactionOperation,
	startWithdrawTransactionOperation,
	confirmStakeTransactionOperation,
	confirmWithdrawTransactionOperation,
	cancelCurrentTransactionOperation
} from './operations';
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
			safeLow: 2000,
			fees: {
				low: { suggestedMaxFeePerGas: 1 },
				medium: { suggestedMaxFeePerGas: 2 },
				high: { suggestedMaxFeePerGas: 3 }
			}
		},
		feePriceEstimates: {
			avarage: 5000,
			fast: 7000,
			safeLow: 2000,
			fees: {
				low: { suggestedMaxFeePerGas: 1 },
				medium: { suggestedMaxFeePerGas: 2 },
				high: { suggestedMaxFeePerGas: 3 }
			}
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
			safeLow: 2000,
			fees: {
				low: { suggestedMaxFeePerGas: 1 },
				medium: { suggestedMaxFeePerGas: 2 },
				high: { suggestedMaxFeePerGas: 3 }
			}
		});
		sinon.stub(ethGasStationInfoSelectors, 'getEthFeeInfoWEI').returns({
			avarage: 5000,
			fast: 7000,
			safeLow: 2000,
			fees: {
				low: { suggestedMaxFeePerGas: 1 },
				medium: { suggestedMaxFeePerGas: 2 },
				high: { suggestedMaxFeePerGas: 3 }
			}
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
	describe('updateTransactionStatusOperation', () => {
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
	beforeEach(() => {
		sinon.restore();
	});
	it('updateStakeReducer', () => {
		let oldStake = { id: '0x0_global', test2: 'test2' };
		let newStake = { serviceOwner: '0x0', serviceId: 'global', test: 'test1' };
		let state = {
			stakes: [oldStake.id],
			stakesById: { [oldStake.id]: oldStake }
		};
		let newState = reducers.updateStakeReducer(
			state,
			marketplacesActions.updateStakeAction(newStake)
		);

		expect(newState).toEqual({
			stakes: [oldStake.id],
			stakesById: {
				[oldStake.id]: {
					id: '0x0_global',
					serviceOwner: '0x0',
					serviceId: 'global',
					test: 'test1',
					test2: 'test2'
				}
			}
		});
	});
	it('setStakesReducer', () => {
		let oldStake = { id: '0x0_global', test2: 'test2' };
		let newStakes = [
			{ serviceOwner: '0x0', serviceId: 'global', test: 'test1' },
			{ serviceOwner: '0x1', serviceId: 'global', test: 'test12' }
		];
		let state = {
			test: 'test',
			stakes: [oldStake.id],
			stakesById: { [oldStake.id]: oldStake }
		};
		let newState = reducers.setStakesReducer(
			state,
			marketplacesActions.setStakesAction(newStakes)
		);

		expect(newState).toEqual({
			test: 'test',
			stakes: ['0x0_global', '0x1_global'],
			stakesById: {
				'0x0_global': {
					id: '0x0_global',
					serviceOwner: '0x0',
					serviceId: 'global',
					test: 'test1'
				},
				'0x1_global': {
					id: '0x1_global',
					serviceOwner: '0x1',
					serviceId: 'global',
					test: 'test12'
				}
			}
		});
	});
	it('addTransactionReducer', () => {
		let state = {
			test: 'test',
			transactions: [1],
			transactionsById: {
				1: { id: 1, lastStatus: 'pending' }
			}
		};
		let transaction = { id: 2, lastStatus: 'success' };

		let newState = reducers.addTransactionReducer(
			state,
			marketplacesActions.addTransactionAction(transaction)
		);

		expect(newState).toEqual({
			test: 'test',
			transactions: [1, 2],
			transactionsById: {
				1: { id: 1, lastStatus: 'pending' },
				2: { id: 2, lastStatus: 'success' }
			}
		});
	});
	it('setTransactionsReducer', () => {
		let state = {
			test: 'test',
			transactions: [1],
			transactionsById: {
				1: { id: 1, lastStatus: 'pending' }
			}
		};
		let transaction = [{ id: 2, lastStatus: 'success' }, { id: 3, lastStatus: 'pending' }];

		let newState = reducers.setTransactionsReducer(
			state,
			marketplacesActions.setTransactionsAction(transaction)
		);

		expect(newState).toEqual({
			test: 'test',
			transactions: [2, 3],
			transactionsById: {
				2: { id: 2, lastStatus: 'success' },
				3: { id: 3, lastStatus: 'pending' }
			}
		});
	});
	it('updateTransactionReducer', () => {
		let state = {
			test: 'test',
			transactions: [1],
			transactionsById: {
				1: { id: 1, lastStatus: 'pending' }
			}
		};
		let transaction = { id: 1, lastStatus: 'success', test: 'test1' };

		let newState = reducers.updateTransactionReducer(
			state,
			marketplacesActions.updateTransactionAction(transaction)
		);

		expect(newState).toEqual({
			test: 'test',
			transactions: [1],
			transactionsById: {
				1: { id: 1, lastStatus: 'success', test: 'test1' }
			}
		});
	});
	it('setMarketplacePopupReducer', () => {
		let state = {
			displayedPopup: null
		};

		let newState = reducers.setMarketplacePopupReducer(
			state,
			marketplacesActions.showMarketplacePopupAction('test')
		);
		expect(newState).toEqual({
			displayedPopup: 'test'
		});
	});
	it('clearCurrentTransactionReducer', () => {
		let state = {
			currentTransaction: { test: 'test1', test2: 'test2' }
		};

		let newState = reducers.clearCurrentTransactionReducer(
			state,
			marketplacesActions.clearCurrentTransactionAction()
		);
		expect(newState).toEqual({
			currentTransaction: null
		});
	});
	it('setCurrentTransactionReducer', () => {
		let state = {
			currentTransaction: null
		};

		let newState = reducers.setCurrentTransactionReducer(
			state,
			marketplacesActions.setCurrentTransactionAction({ test: 'test1', test2: 'test2' })
		);
		expect(newState).toEqual({
			currentTransaction: { test: 'test1', test2: 'test2' }
		});
	});
	it('updateCurrentTransactionReducer', () => {
		let state = {
			currentTransaction: { test: 'test1', test2: 'test2' }
		};

		let newState = reducers.updateCurrentTransactionReducer(
			state,
			marketplacesActions.updateCurrentTransactionAction({
				test2: 'test3',
				test5: 'test5'
			})
		);
		expect(newState).toEqual({
			currentTransaction: {
				test: 'test1',
				test2: 'test3',
				test5: 'test5'
			}
		});
	});
	it('envokes update stake reducer', () => {
		sinon.stub(reducers, 'updateStakeReducer');
		reducer({}, marketplacesActions.updateStakeAction({}));
		expect(reducers.updateStakeReducer.calledOnce).toBeTruthy();
	});
	it('envokes set stakes reducer', () => {
		sinon.stub(reducers, 'setStakesReducer');
		reducer({}, marketplacesActions.setStakesAction({}));
		expect(reducers.setStakesReducer.calledOnce).toBeTruthy();
	});
	it('envokes add transaction reducer', () => {
		sinon.stub(reducers, 'addTransactionReducer');
		reducer({}, marketplacesActions.addTransactionAction({}));
		expect(reducers.addTransactionReducer.calledOnce).toBeTruthy();
	});
	it('envokes set transactions reducer', () => {
		sinon.stub(reducers, 'setTransactionsReducer');
		reducer({}, marketplacesActions.setTransactionsAction({}));
		expect(reducers.setTransactionsReducer.calledOnce).toBeTruthy();
	});
	it('envokes update transaction reducer', () => {
		sinon.stub(reducers, 'updateTransactionReducer');
		reducer({}, marketplacesActions.updateTransactionAction({}));
		expect(reducers.updateTransactionReducer.calledOnce).toBeTruthy();
	});
	it('envokes set marketplace popup reducer', () => {
		sinon.stub(reducers, 'setMarketplacePopupReducer');
		reducer({}, marketplacesActions.showMarketplacePopupAction({}));
		expect(reducers.setMarketplacePopupReducer.calledOnce).toBeTruthy();
	});
	it('envokes set current transaction reducer', () => {
		sinon.stub(reducers, 'setCurrentTransactionReducer');
		reducer({}, marketplacesActions.setCurrentTransactionAction({}));
		expect(reducers.setCurrentTransactionReducer.calledOnce).toBeTruthy();
	});
	it('envokes update current transaction reducer', () => {
		sinon.stub(reducers, 'updateCurrentTransactionReducer');
		reducer({}, marketplacesActions.updateCurrentTransactionAction({}));
		expect(reducers.updateCurrentTransactionReducer.calledOnce).toBeTruthy();
	});
	it('envokes clear current transaction reducer', () => {
		sinon.stub(reducers, 'clearCurrentTransactionReducer');
		reducer({}, marketplacesActions.clearCurrentTransactionAction({}));
		expect(reducers.clearCurrentTransactionReducer.calledOnce).toBeTruthy();
	});
});
