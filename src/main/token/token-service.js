'use strict';
import Token from './token';
import { getGlobalContext } from 'common/context';
import { BigNumber } from 'bignumber.js';
import { abi as customSymbolABI } from '../assets/data/abi-custom-symbol.json';

export class TokenService {
	constructor() {
		this.web3Service = getGlobalContext().web3Service;
		this.contractABI = this.web3Service.abi;
	}

	loadTokens() {
		return Token.findAll();
	}

	async addToken(token) {
		const existingToken = await Token.findByAddress(token.address);
		if (existingToken.length > 0) {
			return existingToken[0];
		}
		token.isCustom = 1;
		return Token.create(token);
	}

	async getTokenInfo(contractAddress) {
		let tokenContract = new this.web3Service.web3.eth.Contract(
			this.contractABI,
			contractAddress
		);
		const decimal = parseInt(await tokenContract.methods.decimals().call());
		let symbol = '';
		// This try catch is a workaround for this issue https://stackoverflow.com/questions/55916175/web3-how-to-call-method-which-return-bytes-32
		try {
			symbol = await tokenContract.methods.symbol().call();
		} catch (error) {
			if (error.message.indexOf('Number can only safely store up to 53 bits') !== -1) {
				tokenContract = new this.web3Service.web3.eth.Contract(
					customSymbolABI,
					contractAddress
				);
				symbol = this.web3Service.web3.utils.hexToAscii(
					await tokenContract.methods.symbol().call()
				);
			}
		}
		return {
			address: contractAddress,
			symbol,
			decimal
		};
	}

	async getGasLimit(contractAddress, address, amount, decimal, fromAddress) {
		const tokenContract = new this.web3Service.web3.eth.Contract(
			this.contractABI,
			contractAddress
		);
		const MAX_GAS = 4500000;
		const amountWithDecimals = new BigNumber(amount)
			.times(new BigNumber(10).pow(decimal))
			.toString();
		const estimate = await tokenContract.methods
			.transfer(address, amountWithDecimals)
			.estimateGas({ from: fromAddress });
		return Math.round(Math.min(estimate * 1.1, MAX_GAS));
	}
}

export default TokenService;
