import * as actions from './actions';
import Web3Service from 'main/blockchain/web3-service';
import { getWallet } from 'common/wallet/selectors';
import { getTransaction } from './selectors';
import EthUnits from 'common/utils/eth-units';
import EthUtils from 'common/utils/eth-utils';
import config from 'common/config';
import Tx from 'ethereumjs-tx';

const web3Service = new Web3Service();
const web3Utils = web3Service.constructor.web3.utils;

const init = () => async dispatch => {
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
			addressError: false,
			sending: false
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

const signTransaction = async (rawTx, privateKey) => {
	let eTx = new Tx(rawTx);
	eTx.sign(privateKey);
	return `0x${eTx.serialize().toString('hex')}`;
};

const startSend = cryptoCurrency => async (dispatch, getState) => {
	const state = getState();
	const wallet = getWallet(state);
	const transaction = getTransaction(state);

	const rawTx = {
		nonce: EthUtils.sanitizeHex(EthUtils.decimalToHex(transaction.nonce)),
		gasPrice: EthUtils.sanitizeHex(
			EthUtils.decimalToHex(EthUnits.unitToUnit(transaction.gasPrice, 'gwei', 'wei'))
		),
		gasLimit: EthUtils.sanitizeHex(EthUtils.decimalToHex(transaction.gasLimit)),
		to: EthUtils.sanitizeHex(transaction.address),
		value: EthUtils.sanitizeHex(
			EthUtils.decimalToHex(
				cryptoCurrency === 'ETH'
					? EthUnits.unitToUnit(transaction.amount, 'ether', 'wei')
					: transaction.amount
			)
		),
		chainId: config.chainId || 3 // if missing - use ropsten testnet
	};

	const signedHex = await signTransaction(rawTx, wallet.privateKey);
	await dispatch(
		actions.updateTransaction({
			signedHex,
			sending: true
		})
	);
};

const cancelSend = () => async dispatch => {
	await dispatch(
		actions.updateTransaction({
			signedHex: '',
			sending: false
		})
	);
};

const confirmSend = () => async (dispatch, getState) => {
	const transaction = getTransaction(getState());
	console.log('transaction.signedHex', transaction.signedHex);
	const params = {
		method: 'sendSignedTransaction',
		args: [transaction.signedHex]
	};

	await web3Service.waitForTicket(params);
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
	confirmSend
};
