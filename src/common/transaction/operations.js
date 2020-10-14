import * as actions from './actions';
import * as types from './types';
import { createAliasedAction } from 'electron-redux';
import { getGlobalContext } from 'common/context';
import { getWallet } from 'common/wallet/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getTransaction } from './selectors';
import EthUnits from 'common/utils/eth-units';
import EthUtils from 'common/utils/eth-utils';
import config from 'common/config';
import { BigNumber } from 'bignumber.js';

import { walletOperations } from 'common/wallet';
import { walletTokensOperations } from 'common/wallet-tokens';
import { push } from 'connected-react-router';
import { appSelectors } from 'common/app';
import { Logger } from 'common/logger';

const log = new Logger('transaction-duck');

const chainId = config.chainId || 3;

const transferHex = '0xa9059cbb';

const hardwalletConfirmationTime = '30000';

export const DEFAULT_ETH_GAS_LIMIT = 21000;

const init = args => async dispatch => {
	await dispatch(
		actions.updateTransaction({
			address: '',
			amount: 0,
			ethFee: 0,
			usdFee: 0,
			gasPrice: 0,
			gasLimit: 0,
			nonce: 0,
			signedHex: '',
			transactionHash: '',
			addressError: false,
			sending: false,
			status: '',
			locked: false,
			...args
		})
	);
};

const setAddress = address => async dispatch => {
	try {
		const web3Utils = (getGlobalContext() || {}).web3Service.web3.utils;
		let toChecksumAddress = web3Utils.toChecksumAddress(address);
		if (web3Utils.isHex(address) && web3Utils.isAddress(toChecksumAddress)) {
			await dispatch(actions.updateTransaction({ address }));
			await dispatch(actions.setAddressError(false));
			await dispatch(setTransactionFee(address, undefined, undefined, undefined));
		} else {
			await dispatch(actions.setAddressError(true));
		}
	} catch (e) {
		log.error(e);
		await dispatch(actions.setAddressError(true));
	}
};

export const getGasLimit = async (
	cryptoCurrency,
	address,
	amount,
	decimals,
	walletAddress,
	nonce,
	tokenContract
) => {
	const { tokenService, walletService } = getGlobalContext();
	// Return default gas limit for Ethereum
	if (cryptoCurrency === 'ETH') {
		const amountInWei = EthUnits.unitToUnit(amount, 'ether', 'wei');
		const gasLimit = await walletService.estimateGas({
			to: address,
			value: amountInWei,
			nonce
		});

		return gasLimit || DEFAULT_ETH_GAS_LIMIT;
	}

	return tokenService.getGasLimit(tokenContract, address, amount, decimals, walletAddress, nonce);
};

export const getTransactionCount = async address => {
	const params = {
		method: 'getTransactionCount',
		args: [address, 'pending']
	};

	return (getGlobalContext() || {}).web3Service.waitForTicket(params);
};

export const setTransactionFee = (newAddress, newAmount, newGasPrice, newGasLimit) => async (
	dispatch,
	getState
) => {
	try {
		const state = getState();
		const transaction = getTransaction(state);
		const address = !newAddress ? transaction.address : newAddress;
		const amount = !newAmount ? transaction.amount : newAmount;
		const walletAddress = state.wallet.address;

		dispatch(setLocked(true));

		let gasPrice = state.ethGasStationInfo.ethGasStationInfo.average;
		if (newGasPrice) {
			gasPrice = newGasPrice;
		} else if (transaction.gasPrice) {
			gasPrice = transaction.gasPrice;
		}

		if (address && amount) {
			const tokenContract = transaction.contractAddress;
			const tokenDecimal = transaction.tokenDecimal;
			const nonce = await getTransactionCount(walletAddress);
			const cryptoCurrency = transaction.cryptoCurrency;
			let gasLimit = DEFAULT_ETH_GAS_LIMIT;
			let gasLimitUpdated = transaction.gasLimitUpdated;

			if (newGasLimit) {
				gasLimit = newGasLimit;
				gasLimitUpdated = true;
			} else if (transaction.gasLimitUpdated && transaction.gasLimit) {
				gasLimit = transaction.gasLimit;
			} else {
				gasLimit = await getGasLimit(
					cryptoCurrency,
					address,
					amount,
					tokenDecimal,
					walletAddress,
					nonce,
					tokenContract
				);
			}

			const gasPriceInWei = EthUnits.unitToUnit(gasPrice, 'gwei', 'wei');
			const feeInWei = String(Math.round(gasPriceInWei * gasLimit));
			const feeInEth = (getGlobalContext() || {}).web3Service.web3.utils.fromWei(
				feeInWei,
				'ether'
			);

			await dispatch(
				actions.updateTransaction({
					ethFee: feeInEth,
					gasPrice: gasPrice,
					gasLimit,
					gasLimitUpdated,
					nonce
				})
			);
		}

		dispatch(setLocked(false));
	} catch (e) {
		log.error(e);
	}
};

const setAmount = amount => async dispatch => {
	await dispatch(
		actions.updateTransaction({
			amount
		})
	);
	await dispatch(setTransactionFee(undefined, amount, undefined, undefined));
};

export const setLocked = locked =>
	actions.updateTransaction({
		locked: locked
	});

const setGasPrice = gasPrice => async dispatch => {
	await dispatch(
		actions.updateTransaction({
			gasPrice
		})
	);
	await dispatch(setTransactionFee(undefined, undefined, gasPrice, undefined));
};

const setLimitPrice = gasLimit => async dispatch => {
	await dispatch(
		actions.updateTransaction({
			gasLimit
		})
	);
	await dispatch(setTransactionFee(undefined, undefined, undefined, gasLimit));
};

const generateContractData = (toAddress, value, decimal) => {
	value = EthUtils.padLeft(
		new BigNumber(value).times(new BigNumber(10).pow(decimal)).toString(16),
		64
	);
	toAddress = EthUtils.padLeft(EthUtils.getNakedAddress(toAddress), 64);
	return transferHex + toAddress + value;
};

const confirmSend = () => async (dispatch, getState) => {
	const { walletService, matomoService } = getGlobalContext();
	const state = getState();
	const transaction = getTransaction(state);
	const { cryptoCurrency } = transaction;

	const transactionObject = {
		nonce: transaction.nonce,
		gasPrice: EthUnits.unitToUnit(transaction.gasPrice, 'gwei', 'wei'),
		gas: transaction.gasLimit
	};

	if (cryptoCurrency === 'ETH') {
		transactionObject.to = EthUtils.sanitizeHex(transaction.address);
		transactionObject.value = EthUnits.unitToUnit(transaction.amount, 'ether', 'wei');
	} else {
		transactionObject.to = EthUtils.sanitizeHex(transaction.contractAddress);
		transactionObject.value = 0;
		const data = generateContractData(
			transaction.address,
			transaction.amount,
			transaction.tokenDecimal
		);
		transactionObject.data = EthUtils.sanitizeHex(data);
	}

	const transactionEventEmitter = walletService.sendTransaction(transactionObject);

	matomoService.trackEvent(`transaction`, 'send', cryptoCurrency);

	let hardwalletConfirmationTimeout = null;
	const walletType = appSelectors.selectWalletType(state);
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
		await dispatch(
			actions.updateTransaction({
				status: 'Pending',
				transactionHash: hash
			})
		);
		matomoService.trackEvent(`transaction`, 'in-progress', cryptoCurrency);
		await dispatch(push('/main/transaction-progress'));
		dispatch(createTxHistry(hash));
	});

	transactionEventEmitter.on('receipt', async receipt => {
		await dispatch(updateBalances());
		matomoService.trackEvent(`transaction`, 'success', cryptoCurrency);
	});

	transactionEventEmitter.on('error', async error => {
		clearTimeout(hardwalletConfirmationTimeout);
		matomoService.trackEvent(`transaction`, 'error', cryptoCurrency);
		log.error('transactionEventEmitter ERROR: %j', error);
		const message = error.toString().toLowerCase();
		if (message.indexOf('insufficient funds') !== -1 || message.indexOf('underpriced') !== -1) {
			await dispatch(
				actions.updateTransaction({
					status: 'NoBalance'
				})
			);
			await dispatch(push('/main/transaction-no-gas-error'));
		} else if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
			await dispatch(push('/main/transaction-declined/Ledger'));
		} else if (error.code === 'Failure_ActionCancelled') {
			await dispatch(push('/main/transaction-declined/Trezor'));
		} else if (error.statusText === 'UNKNOWN_ERROR') {
			await dispatch(push('/main/transaction-unlock'));
		} else {
			await dispatch(
				actions.updateTransaction({
					status: 'Error'
				})
			);
			await dispatch(push('/main/transaction-error'));
		}
	});
};

const marketplaceSend = ({ onReceipt, onTransactionHash, onTransactionError }) => async (
	dispatch,
	getState
) => {
	const { walletService, matomoService } = getGlobalContext();
	const state = getState();
	const transaction = getTransaction(state);
	const { cryptoCurrency } = transaction;

	const transactionObject = {
		nonce: transaction.nonce,
		gasPrice: EthUnits.unitToUnit(transaction.gasPrice, 'gwei', 'wei'),
		gas: transaction.gasLimit
	};

	if (cryptoCurrency === 'ETH') {
		transactionObject.to = EthUtils.sanitizeHex(transaction.address);
		transactionObject.value = EthUnits.unitToUnit(transaction.amount, 'ether', 'wei');
	} else {
		transactionObject.to = EthUtils.sanitizeHex(transaction.contractAddress);
		transactionObject.value = 0;
		const data = generateContractData(
			transaction.address,
			transaction.amount,
			transaction.tokenDecimal
		);
		transactionObject.data = EthUtils.sanitizeHex(data);
	}

	const transactionEventEmitter = walletService.sendTransaction(transactionObject);
	matomoService.trackEvent(`marketplace_transaction`, 'send', cryptoCurrency);

	transactionEventEmitter.on('receipt', async receipt => {
		dispatch(updateBalances());
		matomoService.trackEvent(`marketplace_transaction`, 'success', cryptoCurrency);
		onReceipt(receipt);
	});
	transactionEventEmitter.on('transactionHash', async transactionHash => {
		await dispatch(actions.updateTransaction({ status: 'Pending', transactionHash }));
		matomoService.trackEvent(`marketplace_transaction`, 'in-progress', cryptoCurrency);
		dispatch(createTxHistry(transactionHash));
		onTransactionHash(transactionHash);
	});
	transactionEventEmitter.on('error', async error => {
		matomoService.trackEvent(`marketplace_transaction`, 'error', cryptoCurrency);
		onTransactionError(error);
	});

	return transactionEventEmitter;
};

const incorporationSend = (companyCode, countryCode) => async (dispatch, getState) => {
	const { walletService, matomoService } = getGlobalContext();
	const state = getState();
	const transaction = getTransaction(state);
	const { cryptoCurrency } = transaction;

	const transactionObject = {
		nonce: transaction.nonce,
		gasPrice: EthUnits.unitToUnit(transaction.gasPrice, 'gwei', 'wei'),
		gas: transaction.gasLimit
	};

	if (cryptoCurrency === 'ETH') {
		transactionObject.to = EthUtils.sanitizeHex(transaction.address);
		transactionObject.value = EthUnits.unitToUnit(transaction.amount, 'ether', 'wei');
	} else {
		transactionObject.to = EthUtils.sanitizeHex(transaction.contractAddress);
		transactionObject.value = 0;
		const data = generateContractData(
			transaction.address,
			transaction.amount,
			transaction.tokenDecimal
		);
		transactionObject.data = EthUtils.sanitizeHex(data);
	}

	const transactionEventEmitter = walletService.sendTransaction(transactionObject);
	matomoService.trackEvent(`incorporations_transaction`, 'sent', cryptoCurrency);

	let hardwalletConfirmationTimeout = null;
	if (appSelectors.selectWalletType(state) !== '') {
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
		matomoService.trackEvent(`incorporations_transaction`, 'in-progress', cryptoCurrency);
		await dispatch(
			actions.updateTransaction({
				status: 'Pending',
				transactionHash: hash
			})
		);
		await dispatch(push('/main/transaction-progress'));
		dispatch(createTxHistry(hash));
	});

	transactionEventEmitter.on('receipt', async receipt => {
		await dispatch(updateBalances());
		matomoService.trackEvent(`incorporations_transaction`, 'success', cryptoCurrency);
		await dispatch(
			push(`/main/marketplace/incorporation/process-started/${companyCode}/${countryCode}`)
		);
	});

	transactionEventEmitter.on('error', async error => {
		clearTimeout(hardwalletConfirmationTimeout);
		matomoService.trackEvent(`incorporations_transaction`, 'error', cryptoCurrency);
		log.error('transactionEventEmitter ERROR: %j', error);
		const message = error.toString().toLowerCase();
		if (message.indexOf('insufficient funds') !== -1 || message.indexOf('underpriced') !== -1) {
			await dispatch(
				actions.updateTransaction({
					status: 'NoBalance'
				})
			);
			await dispatch(push('/main/transaction-no-gas-error'));
		} else if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
			await dispatch(push('/main/transaction-declined/Ledger'));
		} else if (error.code === 'Failure_ActionCancelled') {
			await dispatch(push('/main/transaction-declined/Trezor'));
		} else if (error.statusText === 'UNKNOWN_ERROR') {
			await dispatch(push('/main/transaction-unlock'));
		} else {
			await dispatch(
				actions.updateTransaction({
					status: 'Error'
				})
			);
			await dispatch(push('/main/transaction-error'));
		}
	});
};

const sendSwapTransaction = ({ transaction, token }) => async (dispatch, getState) => {
	const { walletService, matomoService } = getGlobalContext();
	const state = getState();

	const transactionEventEmitter = walletService.sendTransaction(transaction);
	matomoService.trackEvent(`swap_transaction`, 'sent', transaction.cryptoCurrency);

	let hardwalletConfirmationTimeout = null;
	const walletType = appSelectors.selectWalletType(state);

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
		matomoService.trackEvent(`swap_transaction`, 'in-progress', transaction.cryptoCurrency);
		await dispatch(
			actions.updateTransaction({
				status: 'Pending',
				transactionHash: hash
			})
		);
		await dispatch(push('/main/transaction-progress'));
		dispatch(createTxHistry(hash));
	});

	transactionEventEmitter.on('receipt', async receipt => {
		await dispatch(updateBalances());
		matomoService.trackEvent(`swap_transaction`, 'success', transaction.cryptoCurrency);
		await dispatch(push(`/main/swap-completed/${token}`));
	});

	transactionEventEmitter.on('error', async error => {
		clearTimeout(hardwalletConfirmationTimeout);
		matomoService.trackEvent(`swap_transaction`, 'error', transaction.cryptoCurrency);
		log.error('transactionEventEmitter ERROR: %j', error);
		const message = error.toString().toLowerCase();
		if (message.indexOf('insufficient funds') !== -1 || message.indexOf('underpriced') !== -1) {
			await dispatch(
				actions.updateTransaction({
					status: 'NoBalance'
				})
			);
			await dispatch(push('/main/transaction-no-gas-error'));
		} else if (error.statusText === 'CONDITIONS_OF_USE_NOT_SATISFIED') {
			await dispatch(push('/main/transaction-declined/Ledger'));
		} else if (error.code === 'Failure_ActionCancelled') {
			await dispatch(push('/main/transaction-declined/Trezor'));
		} else if (error.statusText === 'UNKNOWN_ERROR') {
			await dispatch(push('/main/transaction-unlock'));
		} else {
			await dispatch(
				actions.updateTransaction({
					status: 'Error'
				})
			);
			await dispatch(push('/main/transaction-error'));
		}
	});
};

const updateBalances = () => async (dispatch, getState) => {
	let wallet = getWallet(getState());

	// the first one is ETH
	let tokens = getTokens(getState()).splice(1);

	await dispatch(walletOperations.updateWalletWithBalance(wallet));
	await dispatch(walletTokensOperations.updateWalletTokensWithBalance(tokens, wallet.address));

	await dispatch(
		actions.updateTransaction({
			status: 'Sent!'
		})
	);
};

const createTxHistry = transactionHash => (dispatch, getState) => {
	const wallet = getWallet(getState());
	const transaction = getTransaction(getState());
	const { cryptoCurrency } = transaction;
	const tokenSymbol = cryptoCurrency === 'ETH' ? null : cryptoCurrency;
	const data = {
		...transaction,
		tokenSymbol,
		networkId: chainId,
		from: wallet.address,
		to: transaction.address,
		value: +transaction.amount,
		gasPrice: +transaction.gasPrice,
		hash: transactionHash
	};

	dispatch(actions.createTxHistory(data));
};

const setCryptoCurrency = cryptoCurrency => async dispatch => {
	await dispatch(
		actions.updateTransaction({
			cryptoCurrency
		})
	);
};

export default {
	...actions,
	setAddress: createAliasedAction(types.ADDRESS_SET, setAddress),
	setAmount: createAliasedAction(types.AMOUNT_SET, setAmount),
	setGasPrice: createAliasedAction(types.GAS_PRICE_SET, setGasPrice),
	setLimitPrice: createAliasedAction(types.LIMIT_PRICE_SET, setLimitPrice),
	init: createAliasedAction(types.INIT, init),
	setTransactionFee: createAliasedAction(types.TRANSACTION_FEE_SET, setTransactionFee),
	confirmSend: createAliasedAction(types.CONFIRM_SEND, confirmSend),
	incorporationSend: createAliasedAction(types.INCORPORATION_SEND, incorporationSend),
	marketplaceSend: createAliasedAction(types.MARKETPLACE_SEND, marketplaceSend),
	setCryptoCurrency: createAliasedAction(types.CRYPTO_CURRENCY_SET, setCryptoCurrency),
	sendSwapTransaction: createAliasedAction(types.SWAP, sendSwapTransaction),
	setLocked: createAliasedAction(types.LOCKED_SET, setLocked)
};
