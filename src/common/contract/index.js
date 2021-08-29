import { normalize, schema } from 'normalizr';
import { getGlobalContext } from 'common/context';
import { createAliasedAction } from 'electron-redux';
import { walletSelectors } from 'common/wallet';
import { getTokenByAddress, getTokenBySymbol } from '../wallet-tokens/selectors';
import { push } from 'connected-react-router';
import { validateAllowanceAmount, validateContractAddress } from './utils';
import _ from 'lodash';
import { getWallet } from '../wallet/selectors';
import { appSelectors } from 'common/app';
import { Logger } from 'common/logger';
import { getTransactionCount } from '../transaction/operations';
import { getAmountUsd } from '../transaction/selectors';
import EthUnits from '../utils/eth-units';
import { ethGasStationInfoSelectors } from 'common/eth-gas-station';

const log = new Logger('contract-duck');
const hardwalletConfirmationTime = '30000';
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
	CONTRACTS_ALLOWANCE_EDITOR_OPERATION_UPDATE: 'contracts/allowances/editor/operations/UPDATE',
	CONTRACTS_ALLOWANCE_EDITOR_OPERATION_START: 'contracts/allowances/editor/operations/START',
	CONTRACTS_ALLOWANCE_EDITOR_OPERATION_SUBMIT: 'contracts/allowances/editor/operations/SUBMIT',
	CONTRACTS_ALLOWANCE_EDITOR_OPERATION_REQUEST: 'contracts/allowances/editor/operations/REQUEST',
	CONTRACTS_ALLOWANCE_EDITOR_OPERATION_CANCEL: 'contracts/allowances/editor/operations/CANCEL',
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
		const { contractAllowanceService } = getGlobalContext();
		const allowance = await contractAllowanceService.loadContractAllowanceById(id);
		await dispatch(contractActions.setOneAllowanceAction(allowance));
		return allowance;
	},
	fetchAllowanceOperation: (tokenAddress, contractAddress, tokenDecimals = 18) => async (
		dispatch,
		getState
	) => {
		const { contractAllowanceService } = getGlobalContext();
		let allowance = contractSelectors.selectAllowanceByTokenAndContractAddress(
			getState(),
			tokenAddress,
			contractAddress
		);

		if (!allowance) {
			const wallet = getWallet(getState());
			allowance = await contractAllowanceService.createContractAllowance(
				wallet.id,
				contractAddress,
				tokenAddress,
				tokenDecimals
			);
		}
		return dispatch(operations.reloadAllowanceOperation(allowance.id));
	},
	updateAllowanceEditorOperation: update => async (dispatch, getState) => {
		try {
			const { contractAllowanceService } = getGlobalContext();
			const beforeUpdate = contractSelectors.selectAllowanceEditor(getState());
			const wallet = getWallet(getState());

			if (
				update &&
				update.tokenAddress &&
				update.tokenAddress !== beforeUpdate.tokenAddress
			) {
				const token = getTokenByAddress(getState(), update.tokenAddress);
				if (token) {
					update.tokenDecimals = token.decimal;
					update.tokenSymbol = token.symbol;
				}
			}

			if (
				update &&
				update.contractAddress &&
				update.contractAddress !== beforeUpdate.contractAddress
			) {
				if (!update.contractName) {
					const contract = contractSelectors.selectContractByAddress(
						getState(),
						update.contractAddress
					);
					if (contract && contract.name) {
						update.contractName = contract.name;
					}
				}
			}

			if (!beforeUpdate.nonce && update && !update.nonce) {
				update.nonce = await getTransactionCount(wallet.address);
			}

			if (update) {
				await dispatch(contractActions.updateEditorAction(update));
			}

			const afterUpdate = contractSelectors.selectAllowanceEditor(getState());

			if (
				!afterUpdate.contractAddress ||
				!afterUpdate.tokenAddress ||
				(!afterUpdate.loading &&
					(beforeUpdate.contractAddress === afterUpdate.contractAddress &&
						beforeUpdate.tokenAddress === afterUpdate.tokenAddress))
			) {
				return;
			}

			if (afterUpdate.errors.contractError || afterUpdate.errors.amountError) {
				return;
			}

			const allowance = await dispatch(
				operations.fetchAllowanceOperation(
					afterUpdate.tokenAddress,
					afterUpdate.contractAddress,
					afterUpdate.tokenDecimals
				)
			);

			let gas = await contractAllowanceService.updateContractAllowanceAmount(
				afterUpdate.tokenAddress,
				afterUpdate.contractAddress,
				afterUpdate.amount || 0,
				afterUpdate.tokenDecimals,
				{ estimateGas: true, from: wallet.address }
			);

			gas = Math.ceil(gas * 1.5);

			let gasPrice = afterUpdate.gasPrice;
			if (!gasPrice) {
				gasPrice = ethGasStationInfoSelectors.getEthGasStationInfo(getState())
					.ethGasStationInfo.medium.suggestedMaxFeePerGas;
			}

			await dispatch(
				contractActions.updateEditorAction({
					currentAmount: allowance.allowanceAmount,
					gasPrice,
					gas,
					loading: false
				})
			);
		} catch (error) {
			log.error(error);
			throw error;
		}
	},
	startAllowanceEditorOperation: options => async (dispatch, getState) => {
		let {
			symbol,
			tokenAddress,
			cancelPath,
			nextPath,
			fixed,
			requestedAmount,
			contractAddress
		} = options;

		const editor = {
			cancelPath,
			nextPath,
			fixed,
			requestedAmount,
			contractAddress,
			loading: true
		};

		let token;

		if (symbol) {
			token = getTokenBySymbol(getState(), symbol);
		}

		if (tokenAddress && !token) {
			token = getTokenByAddress(getState(), tokenAddress);
		}

		if (token) {
			editor.tokenDecimals = token.decimal;
			editor.tokenSymbol = token.symbol;
			editor.tokenAddress = token.address;
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
		let editor = contractSelectors.selectAllowanceEditor(getState());
		const wallet = getWallet(getState());
		const transactionEventEmitter = getGlobalContext().contractAllowanceService.updateContractAllowanceAmount(
			editor.tokenAddress,
			editor.contractAddress,
			editor.amount || 0,
			editor.tokenDecimals,
			{
				from: wallet.address,
				gas: editor.gas,
				gasPrice: EthUnits.unitToUnit(editor.gasPrice, 'gwei', 'wei')
			}
		);

		let hardwalletConfirmationTimeout = null;
		const walletType = appSelectors.selectWalletType(getState());
		if (walletType === 'ledger' || walletType === 'trezor') {
			hardwalletConfirmationTimeout = setTimeout(async () => {
				clearTimeout(hardwalletConfirmationTimeout);
				transactionEventEmitter.removeAllListeners('transactionHash');
				transactionEventEmitter.removeAllListeners('receipt');
				transactionEventEmitter.removeAllListeners('error');
				await dispatch(push('/main/transaction-timeout'));
			}, hardwalletConfirmationTime);
		}

		transactionEventEmitter.on('transactionHash', async hash => {
			clearTimeout(hardwalletConfirmationTimeout);
			await dispatch(push('/main/allowance-transaction-processing'));
		});

		transactionEventEmitter.on('receipt', async receipt => {
			editor = contractSelectors.selectAllowanceEditor(getState());
			if (editor.nextPath) {
				await dispatch(push(editor.nextPath));
			}
		});

		transactionEventEmitter.on('error', async error => {
			clearTimeout(hardwalletConfirmationTimeout);
			log.error('transactionEventEmitter ERROR: %j', error);
			const message = error.toString().toLowerCase();
			if (
				message.indexOf('insufficient funds') !== -1 ||
				message.indexOf('underpriced') !== -1
			) {
				await dispatch(push('/main/transaction-no-gas-error'));
			} else if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
				await dispatch(push('/main/transaction-declined/Ledger'));
			} else if (error.code === 'Failure_ActionCancelled') {
				await dispatch(push('/main/transaction-declined/Trezor'));
			} else if (error.statusText === 'UNKNOWN_ERROR') {
				await dispatch(push('/main/transaction-unlock'));
			} else {
				await dispatch(push('/main/allowance-transaction-error'));
			}
		});
	},
	cancelAllowanceEditorOperation: () => async (dispatch, getState) => {
		const editor = contractSelectors.selectAllowanceEditor(getState());
		let { cancelPath } = editor;

		if (!cancelPath) {
			cancelPath = `/main/allowance-list`;
		}

		await dispatch(push(cancelPath));
		await dispatch(contractActions.setEditorAction({}));
	},
	requestAllowanceOperation: options => async (dispatch, getState) => {
		const allowance = await dispatch(
			operations.fetchAllowanceOperation(
				options.tokenAddress,
				options.contractAddress,
				options.tokenDecimals
			)
		);
		if (allowance.amount >= options.requestedAmount) {
			await dispatch(push(options.nextPath));
			return;
		}
		await dispatch(operations.startAllowanceEditorOperation({ ...options, fixed: true }));
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
	),
	updateAllowanceEditorOperation: createAliasedAction(
		contractTypes.CONTRACTS_ALLOWANCE_EDITOR_OPERATION_UPDATE,
		operations.updateAllowanceEditorOperation
	),
	startAllowanceEditorOperation: createAliasedAction(
		contractTypes.CONTRACTS_ALLOWANCE_EDITOR_OPERATION_START,
		operations.startAllowanceEditorOperation
	),
	submitAllowanceEditorOperation: createAliasedAction(
		contractTypes.CONTRACTS_ALLOWANCE_EDITOR_OPERATION_SUBMIT,
		operations.submitAllowanceEditorOperation
	),
	requestAllowanceOperation: createAliasedAction(
		contractTypes.CONTRACTS_ALLOWANCE_EDITOR_OPERATION_REQUEST,
		operations.requestAllowanceOperation
	),
	cancelAllowanceEditorOperation: createAliasedAction(
		contractTypes.CONTRACTS_ALLOWANCE_EDITOR_OPERATION_CANCEL,
		operations.cancelAllowanceEditorOperation
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
		let editor = this.selectContractsTree(state).editor;

		if (editor.gas && editor.gasPrice) {
			const ethFee = EthUnits.toEther(editor.gasPrice * editor.gas, 'gwei');
			const usdFee = getAmountUsd(state, ethFee, 'ETH');
			editor = { ...editor, ethFee, usdFee };
		}

		return editor;
	}
};

export const contractReducers = {
	setContractsReducer: (state, action) => {
		const normalized = normalize(action.payload, [contractSchema]);

		return {
			...state,
			contracts: normalized.result || [],
			contractsById: normalized.entities.contracts || {}
		};
	},
	setAllowancesReducer: (state, action) => {
		const normalized = normalize(action.payload, [allowanceSchema]);

		return {
			...state,
			allowances: normalized.result || [],
			allowancesById: normalized.entities.allowances || {}
		};
	},
	setOneAllowanceReducer: (state, action) => {
		if (!state.allowancesById[action.payload.id]) {
			state = { ...state, allowances: [...state.allowances, action.payload.id] };
		}
		state = {
			...state,
			allowancesById: { ...state.allowancesById, [action.payload.id]: action.payload }
		};
		return state;
	},
	setAllowanceEditorReducer: (state, action) => {
		state = { ...state, editor: {} };
		return contractReducers.updateAllowanceEditorReducer(state, action);
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
			'loading',
			'checkingAmount',
			'checkingGasPrice',
			'gas',
			'gasPrice',
			'nonce',
			'nextPath',
			'cancelPath'
		]);

		editor = { ...editor, ...options };

		if (payload.amount === '') {
			editor = { ...editor, amount: payload.amount };
		}

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
	switch (action.type) {
		case contractTypes.CONTRACTS_SET:
			return contractReducers.setContractsReducer(state, action);
		case contractTypes.CONTRACTS_ALLOWANCES_SET:
			return contractReducers.setAllowancesReducer(state, action);
		case contractTypes.CONTRACT_ALLOWANCE_EDITOR_SET:
			return contractReducers.setAllowanceEditorReducer(state, action);
		case contractTypes.CONTRACT_ALLOWANCE_EDITOR_UPDATE:
			return contractReducers.updateAllowanceEditorReducer(state, action);
		case contractTypes.CONTRACTS_ALLOWANCES_SET_ONE:
			return contractReducers.setOneAllowanceReducer(state, action);
	}
	return state;
};

export default reducer;

export const testExports = { operations };
