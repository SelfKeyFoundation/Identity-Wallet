import * as actions from './actions';
import Web3Service from 'main/blockchain/web3-service';
import { getWallet } from 'common/wallet/selectors';
import { getTokens } from 'common/wallet-tokens/selectors';
import { getTransaction } from './selectors';
import EthUnits from 'common/utils/eth-units';
import EthUtils from 'common/utils/eth-utils';
import LedgerService from 'main/blockchain/leadger-service';
import config from 'common/config';
import Tx from 'ethereumjs-tx';
import { BigNumber } from 'bignumber.js';

import { walletOperations } from 'common/wallet';
import { walletTokensOperations } from 'common/wallet-tokens';

const web3Service = new Web3Service();
const web3Utils = web3Service.web3.utils;

let txInfoCheckInterval = null;
const TX_CHECK_INTERVAL = 1500;
const ledgerService = new LedgerService({ web3Service });

const chainId = config.chainId || 3;

const transferHex = '0xa9059cbb';

const init = cryptoCurrency => async dispatch => {
	await dispatch(
		actions.updateTransaction({
			address: '',
			amount: 0,
			ethFee: 0,
			usdFee: 0,
			gasPrice: 0,
			gasLimit: 0,
			nouce: 0,
			signedHex: '',
			transactionHash: '',
			addressError: false,
			sending: false,
			cryptoCurrency
		})
	);
};

const setAddress = address => async dispatch => {
	try {
		let toChecksumAddress = web3Utils.toChecksumAddress(address);
		if (web3Utils.isHex(address) && web3Utils.isAddress(toChecksumAddress)) {
			await dispatch(actions.updateTransaction({ address }));
			await dispatch(actions.setAddressError(false));
			await dispatch(setTransactionFee(address, undefined, undefined, undefined));
		} else {
			await dispatch(actions.setAddressError(true));
		}
	} catch (e) {
		await dispatch(actions.setAddressError(true));
	}
};

const getGasLimit = async (newGasLimit, address, amount, walletAddress) => {
	if (newGasLimit) {
		return newGasLimit;
	} else {
		const amountInHex = web3Utils.numberToHex(web3Utils.toWei(amount));

		const params = {
			method: 'estimateGas',
			args: [
				{
					from: walletAddress,
					to: address,
					value: amountInHex
				}
			]
		};

		return web3Service.waitForTicket(params);
	}
};

const getTransactionCount = async publicKey => {
	const params = {
		method: 'getTransactionCount',
		args: [publicKey, 'pending']
	};

	return web3Service.waitForTicket(params);
};

const setTransactionFee = (newAddress, newAmount, newGasPrice, newGasLimit) => async (
	dispatch,
	getState
) => {
	const state = getState();
	const address = !newAddress ? state.transaction.address : newAddress;
	const amount = !newAmount ? state.transaction.amount : newAmount;
	const walletAddress = state.wallet.publicKey;
	const gasPrice = !newGasPrice ? state.ethGasStationInfo.ethGasStationInfo.average : newGasPrice;

	if (address && amount) {
		let gasLimit = await getGasLimit(newGasLimit, address, amount, walletAddress);

		const gasPriceInWei = EthUnits.unitToUnit(gasPrice, 'gwei', 'wei');
		const feeInWei = String(Math.round(gasPriceInWei * gasLimit));
		console.log('feeInWei', feeInWei);
		const feeInEth = web3Utils.fromWei(feeInWei, 'ether');

		const nonce = await getTransactionCount(walletAddress);

		await dispatch(
			actions.updateTransaction({
				ethFee: feeInEth,
				gasPrice: gasPrice,
				gasLimit,
				nonce
			})
		);
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

const signTransaction = async (rawTx, wallet, dispatch) => {
	if (wallet.profile === 'ledger') {
		let signed = await ledgerService.signTransaction({
			dataToSign: rawTx,
			address: `0x${wallet.publicKey}`
		});
		return signed.raw;
	}

	if (wallet.profile === 'trezor') {
		console.log('start');
		await dispatch(
			actions.signTxWithTrezor({
				dataToSign: rawTx,
				accountIndex: 0
			})
		);
		return null;
	}

	const eTx = new Tx(rawTx);
	eTx.sign(wallet.privateKey);
	return `0x${eTx.serialize().toString('hex')}`;
};

const generateContractData = (toAddress, value, decimal) => {
	value = EthUtils.padLeft(
		new BigNumber(value).times(new BigNumber(10).pow(decimal)).toString(16),
		64
	);
	toAddress = EthUtils.padLeft(EthUtils.getNakedAddress(toAddress), 64);
	return transferHex + toAddress + value;
};

const startSend = () => async (dispatch, getState) => {
	const state = getState();
	const wallet = getWallet(state);
	const transaction = getTransaction(state);
	const { cryptoCurrency } = transaction;

	const rawTx = {
		nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(transaction.nonce)),
		gasPrice: EthUtils.sanitizeHex(
			EthUtils.decimalToHex(EthUnits.unitToUnit(transaction.gasPrice, 'gwei', 'wei'))
		),
		gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(transaction.gasLimit)),
		chainId
	};

	if (cryptoCurrency === 'ETH') {
		rawTx.to = EthUtils.sanitizeHex(transaction.address);
		rawTx.value = EthUtils.sanitizeHex(
			EthUtils.decimalToHex(EthUnits.unitToUnit(transaction.amount, 'ether', 'wei'))
		);
	} else {
		rawTx.to = EthUtils.sanitizeHex(transaction.contractAddress);
		rawTx.value = EthUtils.sanitizeHex(0);
		const data = generateContractData(
			transaction.address,
			transaction.amount,
			transaction.tokenDecimal
		);
		rawTx.data = EthUtils.sanitizeHex(data);
	}

	const signedHex = await signTransaction(rawTx, wallet, dispatch);
	if (signedHex) {
		await dispatch(
			actions.updateTransaction({
				signedHex,
				sending: true
			})
		);
	}
};

const cancelSend = () => async dispatch => {
	await dispatch(
		actions.updateTransaction({
			signedHex: '',
			sending: false
		})
	);
};

const updateBalances = oldBalance => async (dispatch, getState) => {
	let wallet = getWallet(getState());
	await dispatch(walletOperations.updateWalletWithBalance(wallet));
	await dispatch(
		walletTokensOperations.updateWalletTokensWithBalance(
			getTokens(getState()),
			wallet.publicKey
		)
	);

	const currentWallet = getWallet(getState());
	if (oldBalance === currentWallet.balance) {
		setTimeout(() => {
			dispatch(updateBalances(oldBalance));
		}, TX_CHECK_INTERVAL);
	} else {
		await dispatch(
			actions.updateTransaction({
				status: 'Sent!'
			})
		);
	}
};

const startTxCheck = (txHash, oldBalance) => (dispatch, getState) => {
	txInfoCheckInterval = setInterval(async () => {
		const txInfo = await web3Service.waitForTicket({
			method: 'getTransactionReceipt',
			args: [txHash]
		});

		if (txInfo && txInfo.blockNumber !== null) {
			const status = Number(txInfo.status);
			if (status) {
				dispatch(updateBalances(oldBalance));
			}
			clearInterval(txInfoCheckInterval);
		}
	}, TX_CHECK_INTERVAL);
};

const startTxBalanceUpdater = transactionHash => (dispatch, getState) => {
	const currentWallet = getWallet(getState());
	dispatch(startTxCheck(transactionHash, currentWallet.balance));
};

const createTxHistry = transaction => (dispatch, getState) => {
	const wallet = getWallet(getState());
	// TODO tokenSymbol, contractAddress, tokenDecimal
	let data = {
		networkId: chainId,
		from: wallet.publicKey,
		to: transaction.address,
		value: +transaction.amount,
		gasPrice: transaction.gasPrice.toString(),
		hash: transaction.transactionHash,
		...transaction
	};

	dispatch(actions.createTxHistory(data));
	return data;
};

const confirmSend = () => async (dispatch, getState) => {
	const transaction = getTransaction(getState());
	const params = {
		method: 'sendSignedTransaction',
		args: [transaction.signedHex],
		contractAddress: null,
		contractMethod: null,
		onceListenerName: 'transactionHash'
	};

	await dispatch(
		actions.updateTransaction({
			status: 'Pending'
		})
	);

	const transactionHash = await web3Service.waitForTicket(params);
	await dispatch(
		actions.updateTransaction({
			transactionHash
		})
	);

	dispatch(createTxHistry(transaction));

	await dispatch(startTxBalanceUpdater(transactionHash));
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
	setAddress,
	setAmount,
	setGasPrice,
	setLimitPrice,
	init,
	setTransactionFee,
	startSend,
	cancelSend,
	confirmSend,
	setCryptoCurrency
};
