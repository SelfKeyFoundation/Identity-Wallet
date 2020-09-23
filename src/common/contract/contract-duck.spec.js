import {
	initialState,
	contractReducers,
	contractActions,
	testExports,
	contractSelectors
} from './index';
import _ from 'lodash';
import sinon from 'sinon';
import { setGlobalContext } from '../context';
import { walletSelectors } from 'common/wallet';

const testContracts = [
	{
		id: 1,
		address: 'test',
		deprecated: false,
		active: true
	},
	{
		id: 2,
		address: 'test2',
		deprecated: false,
		active: true
	},
	{
		id: 3,
		address: 'test3',
		deprecated: true,
		active: true
	},
	{
		id: 4,
		address: 'test4',
		deprecated: true,
		active: false
	}
];

const testAllowances = [
	{
		id: 1,
		address: 'test',
		walletId: 1
	},
	{
		id: 2,
		address: 'test2',
		walletId: 2
	}
];

const testWallet = {
	id: 1,
	address: 'test wallet adddress'
};

describe('Contract DucK', () => {
	let contractService = {
		loadContracts() {}
	};
	let contractAllowanceService = {
		loadContractAllowances() {}
	};
	let state = {};
	let store = {
		dispatch() {},
		getState() {
			return state;
		}
	};
	const testAction = { test: 'test' };
	beforeEach(() => {
		sinon.restore();
		state = { contracts: _.cloneDeep(initialState) };
		setGlobalContext({
			contractService: contractService,
			contractAllowanceService: contractAllowanceService
		});
	});
	describe('Selectors', () => {
		beforeEach(() => {
			state.contracts.contracts = testContracts.map(c => c.id);
			state.contracts.contractsById = testContracts.reduce((acc, curr) => {
				acc[curr.id] = curr;
				return acc;
			}, {});
			state.contracts.allowances = testAllowances.map(c => c.id);
			state.contracts.allowancesById = testAllowances.reduce((acc, curr) => {
				acc[curr.id] = curr;
				return acc;
			}, {});
		});
		it('selectContracts', () => {
			expect(contractSelectors.selectContracts(state)).toEqual(testContracts);
		});
		it('selectContractsByAddress', () => {
			expect(
				contractSelectors.selectContractByAddress(state, testContracts[1].address)
			).toEqual(testContracts[1]);
		});
	});
	describe('Operations', () => {
		xit('fetchAllowanceOperation', async () => {
			// const contractAddress = 'test contract address';
			// const tokenAddress = 'test token address';

			sinon.stub(store, 'dispatch');

			await testExports.operations.fetchAllowanceOperation()(
				store.dispatch,
				store.getState.bind(store)
			);

			expect(contractActions.setContractsAction.calledOnceWith(testContracts)).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});
		it('loadContractsOperation', async () => {
			sinon.stub(contractService, 'loadContracts').resolves(testContracts);
			sinon.stub(contractActions, 'setContractsAction').returns(testAction);
			sinon.stub(store, 'dispatch');

			await testExports.operations.loadContractsOperation()(
				store.dispatch,
				store.getState.bind(store)
			);

			expect(contractActions.setContractsAction.calledOnceWith(testContracts)).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});
		it('loadAllowancesOperation', async () => {
			sinon.stub(contractAllowanceService, 'loadContractAllowances').resolves(testAllowances);
			sinon.stub(contractActions, 'setAllowancesAction').returns(testAction);
			sinon.stub(walletSelectors, 'getWallet').returns(testWallet);
			sinon.stub(store, 'dispatch');

			await testExports.operations.loadAllowancesOperation()(
				store.dispatch,
				store.getState.bind(store)
			);
			expect(
				contractAllowanceService.loadContractAllowances.calledOnceWith(testWallet.id)
			).toBeTruthy();
			expect(contractActions.setAllowancesAction.calledOnceWith(testAllowances)).toBeTruthy();
			expect(store.dispatch.calledOnceWith(testAction)).toBeTruthy();
		});
	});
	describe('Reducers', () => {
		it('setContractsReducer', () => {
			let state = { ...initialState };
			let newState = contractReducers.setContractsReducer(
				state,
				contractActions.setContractsAction([testContracts[0], testContracts[1]])
			);

			expect(newState).toEqual({
				...state,
				contracts: [testContracts[0].id, testContracts[1].id],
				contractsById: {
					[testContracts[0].id]: testContracts[0],
					[testContracts[1].id]: testContracts[1]
				}
			});
		});
		it('setAllowancesReducer', () => {
			let state = { ...initialState };
			let newState = contractReducers.setAllowancesReducer(
				state,
				contractActions.setAllowancesAction([testAllowances[0], testAllowances[1]])
			);

			expect(newState).toEqual({
				...state,
				allowances: [testAllowances[0].id, testAllowances[1].id],
				allowancesById: {
					[testAllowances[0].id]: testAllowances[0],
					[testAllowances[1].id]: testAllowances[1]
				}
			});
		});
		describe('updateAllowanceEditorReducer', () => {
			let state;
			beforeEach(() => {
				state = { ...initialState };
			});
			it('should set contractError on invalid contract address', () => {
				const newState = contractReducers.updateAllowanceEditorReducer(
					state,
					contractActions.updateEditorAction({
						contractAddress: 'sdasadasdasd'
					})
				);
				expect(newState.editor.errors).toBeTruthy();
				expect(newState.editor.errors.contractError).toBeTruthy();
				expect(newState.editor.contractAddress).toEqual('sdasadasdasd');
			});
			it('should remove contractError on valid contract address', () => {
				state = {
					...initialState,
					editor: { ...initialState.editor, errors: { contractError: 'test error' } }
				};
				const newState = contractReducers.updateAllowanceEditorReducer(
					state,
					contractActions.updateEditorAction({
						contractAddress: '0x4cc19356f2d37338b9802aa8e8fc58b0373296e7'
					})
				);
				expect(newState.editor.errors).toBeTruthy();
				expect(newState.editor.errors.contractError).toBeFalsy();
				expect(newState.editor.contractAddress).toEqual(
					'0x4cc19356f2d37338b9802aa8e8fc58b0373296e7'
				);
			});
			it('should validate amount', () => {
				const newState = contractReducers.updateAllowanceEditorReducer(
					state,
					contractActions.updateEditorAction({
						amount: 'sdasadasdasd',
						tokenDecimals: 18
					})
				);
				expect(newState.editor.errors).toBeTruthy();
				expect(newState.editor.errors.amountError).toBeTruthy();
				expect(newState.editor.amount).toEqual('sdasadasdasd');
			});
			it('should remove amountError on valid amount', () => {
				state = {
					...initialState,
					editor: { ...initialState.editor, errors: { amountError: 'test error' } }
				};
				const newState = contractReducers.updateAllowanceEditorReducer(
					state,
					contractActions.updateEditorAction({
						amount: '193.3',
						tokenDecimals: 18
					})
				);
				expect(newState.editor.errors).toBeTruthy();
				expect(newState.editor.errors.amountError).toBeFalsy();
				expect(newState.editor.amount).toEqual('193.3');
			});
			it('should set other options', () => {
				const options = {
					requestedAmount: '15',
					currentAmount: '15',
					contractName: 'test',
					tokenAddress: '0x4cc19356f2d37338b9802aa8e8fc58b0373296e7',
					tokenDecimals: '18',
					tokenSymbol: 'FAFS',
					fixed: true,
					checkingAmount: true,
					checkingGasPrice: true
				};

				const newState = contractReducers.updateAllowanceEditorReducer(
					state,
					contractActions.updateEditorAction(options)
				);

				expect(newState.editor).toMatchObject(options);
			});
		});
	});
});
