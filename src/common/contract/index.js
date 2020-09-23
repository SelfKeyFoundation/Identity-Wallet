import { normalize, schema } from 'normalizr';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from 'common/wallet';
import { getTokenBySymbol } from '../wallet-tokens/selectors';
import { push } from 'connected-react-router';
import { validateAllowanceAmount, validateContractAddress } from './utils';
import _ from 'lodash';

const contractSchema = new schema.Entity('contracts');

const allowanceSchema = new schema.Entity('allowances');

export const initialState = {
	contracts: [],
	contractsById: [],
	allowances: [],
	allowancesById: {},
	editor: {}
};

export const contractTypes = {
	CONTRACTS_SET: 'contracts/SET',
	CONTRACTS_OPERATION_LOAD: 'contracts/operations/LOAD',
	CONTRACTS_ALLOWANCES_SET: 'contracts/allowances/SET',
	CONTRACTS_ALLOWANCES_OPERATION_LOAD: 'contracts/allowances/operations/LOAD',
	CONTRACT_ALLOWANCE_EDITOR_SET: 'contracts/allowances/editor/SET',
	CONTRACT_ALLOWANCE_EDITOR_UPDATE: 'contracts/allowances/editor/UPDATE',
	CONTRACTS_ALLOWANCES_SET_ONE: 'contracts/allowances/SET_ONE'
};

export const contractActions = {
	setContractsAction: payload => ({ type: contractTypes.CONTRACTS_SET, payload }),
	setAllowancesAction: payload => ({ type: contractTypes.CONTRACTS_ALLOWANCES_SET, payload }),
	setEditorAction: payload => ({ type: contractTypes.CONTRACT_ALLOWANCE_EDITOR_SET, payload }),
	updateEditorAction: payload => ({
		type: contractTypes.CONTRACT_ALLOWANCE_EDITOR_UPDATE,
		payload
	}),
	setOneAllowanceAction: payload => ({
		type: contractTypes.CONTRACTS_ALLOWANCES_SET_ONE,
		payload
	})
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
	reloadAllowanceOperation: id => async (dispatch, getState) => {
		const allowance = await getGlobalContext().contractAllowanceService.loadContractAllowanceById(
			id
		);
		await dispatch(contractActions.setOneAllowanceAction(allowance));
		return allowance;
	},
	fetchAllowanceOperation: (tokenAddress, contractAddress) => async (dispatch, getState) => {
		let allowance = contractSelectors.selectAllowanceByTokenAndContractAddress(
			tokenAddress,
			contractAddress
		);
		if (!allowance) {
			allowance = await getGlobalContext().contractAllowanceService.createAllowance();
		}
		await dispatch(operations.reloadAllowanceOperation(allowance.id));
	},
	updateAllowanceEditorOperation: update => async (dispatch, getState) => {
		// contractAddress
		// contractName
		// amount
		// requestedAmount
		// currentAmount
		// checkingAmount
		// checkingGasPrice
		// fixed
		// errors
		// - contractError
		// - allowanceError
		// if (update) {
		// 	await dispatch(contractActions.updateEditorAction(update));
		// }
		// const editor = contractSelectors.selectAllowanceEditor(getState());
		// if (editor.loading && editor.fetchingAllowance) {
		// 	editor.loading = false;
		// }
		// if (editor.errors.contractError || editor.editor.errors.allowanceError) {
		// }
	},
	startAllowanceEditorOperation: options => async (dispatch, getState) => {
		let {
			selectedToken,
			symbol,
			cancelPath,
			nextPath,
			fixed,
			requestedAmount,
			contractAddress
		} = options;

		const editor = {
			selectedToken,
			cancelPath,
			nextPath,
			fixed,
			requestedAmount,
			contractAddress,
			loading: true
		};

		if (!selectedToken && symbol) {
			editor.selectedToken = getTokenBySymbol(getState(), symbol);
		}

		if (contractAddress) {
			const contract = contractSelectors.selectContractByAddress(getState(), contractAddress);
			if (contract) {
				editor.contractName = contract.name;
			}
		}
		await dispatch(contractActions.setEditorAction(editor));

		await dispatch(push('/main/allowance-editor'));

		await dispatch(contractOperations.updateAllowanceEditorOperation());
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
	selectAllowancesByTokenAddress(state, tokenAddress) {
		const allowances = this.selectAllowances(state);
		if (!tokenAddress) {
			return allowances;
		}
		return allowances.filter(a => a.tokenAddress === tokenAddress);
	},
	selectAllowanceByTokenAndContractAddress(state, tokenAddress, contractAddress) {
		return this.selectAllowances(state).find(
			a => a.tokenAddress === tokenAddress && a.contractAddress === contractAddress
		);
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
		return this.selectContractsTree(state).editor;
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
	},
	setAllowanceEditorReducer: (state, action) => {
		state = { ...state, editor: {} };
		this.updateAllowanceEditorReducer(state, action);
	},
	updateAllowanceEditorReducer: (state, action) => {
		const { payload } = action;
		let editor = state.editor;
		let errors = editor.errors;

		if (payload.contractAddress) {
			let contractError;
			if (!validateContractAddress(payload.contractAddress)) {
				contractError = 'Invalid Contract Address';
			}
			errors = { ...errors, contractError };
			editor = { ...editor, contractAddress: payload.contractAddress };
		}
		const options = _.pick(payload, [
			'requestedAmount',
			'currentAmount',
			'contractName',
			'tokenAddress',
			'tokenDecimals',
			'tokenSymbol',
			'fixed',
			'checkingAmount',
			'checkingGasPrice'
		]);

		editor = { ...editor, ...options };

		if (payload.amount && editor.tokenDecimals) {
			let amountError;
			if (!validateAllowanceAmount(payload.amount, editor.tokenDecimals)) {
				amountError = 'Invalid Allowance Amount';
			}
			errors = { ...errors, amountError };
			editor = { ...editor, amount: payload.amount };
		}
		return { ...state, editor: { ...editor, errors: { ...errors } } };
	}
};

export const reducer = (state = initialState, action) => {
	return state;
};

export default reducer;

export const testExports = { operations };
