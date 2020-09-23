import { normalize, schema } from 'normalizr';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from 'common/wallet';

const contractSchema = new schema.Entity('contracts');

const allowanceSchema = new schema.Entity('allowances');

export const initialState = {
	contracts: [],
	contractsById: [],
	allowances: [],
	allowancesById: {},
	allowanceEditor: {}
};

export const contractTypes = {
	CONTRACTS_SET: 'contracts/SET',
	CONTRACTS_OPERATION_LOAD: 'contracts/operations/LOAD',
	CONTRACTS_ALLOWANCES_SET: 'contracts/allowances/SET',
	CONTRACTS_ALLOWANCES_OPERATION_LOAD: 'contracts/allowances/operations/LOAD'
};

export const contractActions = {
	setContractsAction: payload => ({ type: contractTypes.CONTRACTS_SET, payload }),
	setAllowancesAction: payload => ({ type: contractTypes.CONTRACTS_ALLOWANCES_SET, payload })
};

const operations = {
	loadContractsOperation: () => async (dispatch, getState) => {
		const { contractService } = getGlobalContext();
		const contracts = await contractService.loadContracts();
		await dispatch(contractActions.setContractsAction(contracts));
	},
	loadAllowancesOperation: () => async (dispatch, getState) => {
		const { contractAllowanceService } = getGlobalContext();
		const wallet = walletSelectors.getWallet(getState());
		const allowances = await contractAllowanceService.loadContractAllowances(wallet.id);
		await dispatch(contractActions.setAllowancesAction(allowances));
	},
	reloadAllowanceOperation: id => async (dispatch, getState) => {},
	fetchAllowanceOperation: (tokenAddress, contractAddress) => async (dispatch, getState) => {
		// select allowance
		// if not exists
		// - create new
		// reload
	},
	startAllowanceEditorOperation: options => async (dispatch, getState) => {
		// initialize editor redux state
		//
	},
	submitAllowanceEditorOperation: options => async (dispatch, getState) => {
		// start allowance transaction operation
		// watch transaction state and navigate trough screens
		// on success -> navigate to next url
		// on cancel -> navigate to cancel url
	},
	cancelAllowanceEditorOperation: () => async (dispatch, getState) => {
		// clear allowance editor action
		// redirect to cancel url
	},
	requestAllowanceOperation: options => async (dispatch, getState) => {
		// fetch allowance
		// if amount correct -> next
		// if amount incorrect -> start allowance editor, with request flag
	}
};

export const contractOperations = {
	...contractActions,
	loadContractsOperation: createAliasedAction(
		contractTypes.CONTRACTS_OPERATION_LOAD,
		operations.loadContractsOperation
	),
	loadAllowancesOperation: createAliasedAction(
		contractTypes.CONTRACTS_ALLOWANCES_OPERATION_LOAD,
		operations.loadAllowancesOperation
	)
};

export const contractSelectors = {
	selectContractsTree(state) {
		return state.contracts;
	},
	selectContracts(state) {
		const tree = this.selectContractsTree(state);
		return tree.contracts.map(id => tree.contractsById[id]);
	},
	selectContractByAddress(state, address) {
		return this.selectContracts(state).find(c => c.address === address);
	},
	selectAllowances(state) {
		const tree = this.selectContractsTree(state);
		const wallet = walletSelectors.getWallet(state);
		return tree.allowances
			.map(id => tree.allowancesById[id])
			.filter(a => a.walletId === wallet.id);
	},
	selectAllowancesByToken(state, tokenAddress) {
		return this.selectAllowances(state).filter(a => a.tokenAddress === tokenAddress);
	},
	selectAllowance(state, tokenAddress, contractAddress) {
		const wallet = walletSelectors.getWallet(state);
		return this.selectAllowances(state).find(
			a =>
				a.tokenAddress === tokenAddress &&
				a.contractAddress === contractAddress &&
				a.walletId === wallet.id
		);
	},
	selectAllowanceEditor(state) {
		return this.selectContractsTree(state).allowanceEditor;
	}
};

export const contractReducers = {
	setContractsReducer: (state, action) => {
		const normalized = normalize(action.payload, [contractSchema]);

		return {
			...state,
			contracts: normalized.result,
			contractsById: normalized.entities.contracts
		};
	},
	setAllowancesReducer: (state, action) => {
		const normalized = normalize(action.payload, [allowanceSchema]);

		return {
			...state,
			allowances: normalized.result,
			allowancesById: normalized.entities.allowances
		};
	}
};

export const reducer = (state = initialState, action) => {
	return state;
};

export default reducer;

export const testExports = { operations };
